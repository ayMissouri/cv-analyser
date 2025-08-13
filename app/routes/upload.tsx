import { useState } from 'react';
import Navbar from '~/Components/Navbar';
import FileUploader from '~/Components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdfToImg';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions, AIResponseFormat } from '../../constants';

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText('Uploading your CV...');
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) return setStatusText('Error: Failed to upload CV. Please try again.');

    setStatusText('Converting your CV...');
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

    setStatusText('Uploading image...');
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText('Error: Failed to upload CV image');

    setStatusText('Preparing data...');

    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: '',
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analysing your CV...');
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
    );
    if (!feedback) return setStatusText('Error: Failed to analyse CV. Please try again.');

    const feedbackText =
      typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analysis complete!');
    navigate(`/cv/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) {
      alert('Please upload a CV file.');
      return;
    }

    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.png')] bg-cover">
      <Navbar />

      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1>Easy insights for your CV and Job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2> <img src='/images/resume-scan.gif' className='w-full' alt='scanning' />
            </>
          ) : (
            <h2>Drop your CV for a score and tips!</h2>
          )}

          {!isProcessing && (
            <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
              <div className='form-div'>
                <label htmlFor='company-name'>Company Name</label>
                <input type='text' name='company-name' placeholder='Enter company name' id='company-name' />
              </div>
              <div className='form-div'>
                <label htmlFor='job-title'>Job Title</label>
                <input type='text' name='job-title' placeholder='Enter job title' id='job-title' />
              </div>
              <div className='form-div'>
                <label htmlFor='job-description'>Job Description</label>
                <textarea rows={5} name='job-description' placeholder='Enter job description' id='job-description' />
              </div>
              <div className='form-div'>
                <label htmlFor='uploader'>Upload CV</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type='submit' className='primary-button'>
                Analyse CV
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
