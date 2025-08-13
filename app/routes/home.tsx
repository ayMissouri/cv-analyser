import { resumes } from '../../constants';
import type { Route } from './+types/home';
import Navbar from '~/Components/Navbar';
import ResumeCard from '~/Components/ResumeCard';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'CVisionary' }, { name: 'description', content: 'Feedback on your CV for your dream job.' }];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.png')] bg-cover">
      <Navbar />

      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1>Track Your CV Ratings & Job Applications</h1>
          <h2>Get feedback on your submissions using AI-powered insights</h2>
        </div>

        {resumes.length > 0 && (
          <div className='resumes-section'>
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
