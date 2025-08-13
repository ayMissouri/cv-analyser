import { useState } from 'react';
import Navbar from '~/Components/Navbar';
import FileUploader from '~/Components/FileUploader';

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name');
    const jobTitle = formData.get('job-title');
    const jobDescription = formData.get('job-description');

    console.log([companyName, jobTitle, jobDescription, file]);
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
