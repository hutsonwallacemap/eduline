/** Official board portals. Links open the board's own site; EduGenie does not host these PDFs. */

export const CBSE_SQP_YEARS = ['2026-27', '2025-26', '2024-25', '2023-24'];

export const cbseSqpUrl = (cls: 'X' | 'XII', year: string) => `https://cbseacademic.nic.in/SQP_CLASS${cls}_${year}.html`;

export const CBSE_LINKS = {
  home: 'https://cbseacademic.nic.in/',
  archive: 'https://cbseacademic.nic.in/sqp_archive.html',
  curriculum: 'https://cbseacademic.nic.in/curriculum.html',
};

export const CISCE_URL = 'https://cisce.org/';

export interface StateBoard {
  state: string;
  board: string;
  url: string;
}

export const STATE_BOARDS: StateBoard[] = [
  { state: 'Andhra Pradesh', board: 'Board of Secondary Education, AP', url: 'https://bse.ap.gov.in/' },
  { state: 'Assam', board: 'SEBA (Board of Secondary Education, Assam)', url: 'https://sebaonline.org/' },
  { state: 'Bihar', board: 'Bihar School Examination Board', url: 'https://biharboardonline.com/' },
  { state: 'Chhattisgarh', board: 'CG Board of Secondary Education', url: 'https://cgbse.nic.in/' },
  { state: 'Gujarat', board: 'Gujarat Secondary and Higher Secondary Education Board', url: 'https://www.gseb.org/' },
  { state: 'Haryana', board: 'Board of School Education Haryana', url: 'https://bseh.org.in/' },
  { state: 'Jharkhand', board: 'Jharkhand Academic Council', url: 'https://jac.jharkhand.gov.in/' },
  { state: 'Karnataka', board: 'Karnataka School Examination and Assessment Board', url: 'https://kseab.karnataka.gov.in/' },
  { state: 'Kerala', board: 'Kerala Pareeksha Bhavan', url: 'https://keralapareekshabhavan.in/' },
  { state: 'Madhya Pradesh', board: 'MP Board of Secondary Education', url: 'https://mpbse.nic.in/' },
  { state: 'Maharashtra', board: 'Maharashtra State Board (MSBSHSE)', url: 'https://mahahsscboard.in/' },
  { state: 'Odisha', board: 'Board of Secondary Education, Odisha', url: 'https://www.bseodisha.ac.in/' },
  { state: 'Punjab', board: 'Punjab School Education Board', url: 'https://www.pseb.ac.in/' },
  { state: 'Rajasthan', board: 'Board of Secondary Education, Rajasthan', url: 'https://rajeduboard.rajasthan.gov.in/' },
  { state: 'Tamil Nadu', board: 'Directorate of Government Examinations, TN', url: 'https://dge.tn.gov.in/' },
  { state: 'Telangana', board: 'Board of Secondary Education, Telangana', url: 'https://bse.telangana.gov.in/' },
  { state: 'Uttar Pradesh', board: 'UP Madhyamik Shiksha Parishad', url: 'https://upmsp.edu.in/' },
  { state: 'West Bengal', board: 'West Bengal Board of Secondary Education', url: 'https://wbbse.wb.gov.in/' },
];
