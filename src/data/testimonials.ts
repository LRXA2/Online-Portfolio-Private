// References. Landing hero shows the excerpt as social proof; the full
// letters live on the experience page (master/detail). Fill placeholder
// slots as remaining letters arrive.
export type Testimonial = {
  placement: string;
  designation: string;
  excerpt?: string;
  full?: string[];
  author: string;
  title: string;
  when?: string;
  placeholder?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    placement: 'Sembcorp II',
    designation: 'Digital Program Manager',
    excerpt:
      'Aarron has helped the team achieve a consistent quarterly forecasting accuracy of 95%…',
    full: [
      "As Aarron's Reporting Officer during his continued internship with Project Crystal—a machine learning initiative aimed at advancing solar energy forecasting—I've worked closely with him to shape the direction of the project and ensure it aligns with our broader business objectives and market expansion efforts. Aarron has played a key role in supporting the project's growth and success.",
      "Over the past few months, Aarron has helped the team achieve a consistent quarterly forecasting accuracy of 95%, which has played a role in reducing liquidated damages. He has explored a wide range of forecasting techniques and climatology-related features, often doing self-directed research to improve model performance. He's also taken initiative in testing new features, suggesting improvements, and informing me proactively on next steps—something that has helped lighten my workload and ensure the project stays on track.",
      "One of Aarron's standout traits is his initiative. He frequently identifies opportunities for improvement—whether in model structure, data quality, or workflow efficiency—and follows through with practical, well-communicated solutions. Despite working independently on many tasks, he remains open to feedback and is always looking for ways to improve.",
      'Aarron has also played a leading role in expanding Project Crystal into new markets such as Vietnam, Indonesia, and India. He helped build much of the foundational pipeline and modeling framework for these regions. Alongside his technical work, he has taken on the responsibility of mentoring newer interns and has worked with the business development team to support customer engagement efforts.',
      "He has also grown in his ability to communicate clearly, whether through technical discussions, written documentation, or stakeholder presentations. He's reliable, self-motivated, and able to manage complex tasks with minimal supervision.",
      "Overall, Aarron has been a key part of Project Crystal's progress. His technical abilities, proactive mindset, and leadership with his peers make him a strong asset to any organization.",
    ],
    author: 'Tristan Tan',
    title: 'Digital Program Manager · Sembcorp Solar',
    when: 'Internship II · Mar 2025 – Jul 2025',
  },
  {
    placement: 'Sembcorp I',
    designation: 'Digital Program Manager',
    excerpt:
      'Aarron helped us achieve an impressive 97% average annual forecast accuracy…',
    full: [
      'Aarron made significant contributions to Project Crystal, a machine learning initiative focused on advancing solar energy forecasting. During his internship, Aarron helped us achieve an impressive 97% average annual forecast accuracy, a substantial improvement over prior methods that elevated the project’s reliability and impact. His technical skills, combined with a strong analytical mindset, were instrumental in achieving this level of precision and provided the organization with more confidence in its operational decisions.',
      'What truly set Aarron apart was his willingness to go above and beyond in every aspect of his work. He proactively explored innovative techniques, refined algorithms, and tackled challenges with creativity and determination. His ownership of tasks, paired with his collaborative approach, ensured steady progress even under tight deadlines. His enthusiasm and positivity also contributed to a productive and supportive team environment.',
      'In addition to his technical expertise, Aarron demonstrated remarkable growth in his communication skills. Initially focused on execution, he quickly developed the ability to clearly present complex findings to both technical and non-technical stakeholders, ensuring his insights were well understood and actionable.',
      'Aarron’s dedication and ingenuity have left a lasting impact on Project Crystal, with tools and processes that continue to drive its success. I am confident his technical expertise, growth mindset, and work ethic will make him a valuable asset to any future team or project.',
    ],
    author: 'Tristan Tan',
    title: 'Digital Program Manager · Sembcorp Solar',
    when: 'Internship I · Mar 2024 – Jan 2025',
  },
  {
    placement: 'Sembcorp I',
    designation: 'Manager · Sembcorp Utilities',
    excerpt:
      '…elevating the project from a proof of concept to a full-scale initiative recognized across the organization.',
    full: [
      'It was a pleasure supervising Aarron Loke Ruixuan during his internship at Sembcorp. As his reporting officer, I observed his strong technical expertise, analytical acumen, and unwavering dedication to his work.',
      'Aarron made significant contributions to Project Crystal, a machine learning initiative for solar energy forecasting. He enhanced prediction accuracy beyond the in-house method, elevating the project from a proof of concept to a full-scale initiative recognized across the organization.',
      'He demonstrated proficiency in SQL, Kusto Query Language (KQL), Grafana, Azure Synapse Analytics, and Python. His ability to research and implement advanced machine learning techniques improved model performance and operational efficiency. Aarron also developed pipelines for data ingestion and streamlined the prediction process, enabling efficient data handling and analysis.',
      'In addition to his technical skills, Aarron excelled in collaboration, aligning project goals with organizational objectives while maintaining professionalism and attention to detail. His contributions were impactful and showcased his ability to tackle complex challenges effectively.',
      'Aarron is a capable and driven individual with exceptional potential in data science and analytics. I am confident he will excel in his future endeavours and be an asset to any organization.',
    ],
    author: 'Zhang Liang',
    title: 'Manager · Sembcorp Utilities',
    when: 'Internship I · Mar 2024 – Jan 2025',
  },
  {
    placement: 'NUS',
    designation: 'Senior Manager · Mathematics',
    excerpt:
      'He designed and implemented an automated system that has notably improved our office’s efficiency.',
    full: [
      'It is with great pleasure that I write this letter of compliment for Aarron Loke Ruixuan, who has made a significant contribution to our organization. He designed and implemented an automated system that has notably improved our office’s efficiency.',
      'Aarron’s work with us involved automating one of our manual processes. He demonstrated a remarkable aptitude for understanding our needs and translating them into a practical, functional solution. His fresh perspective and technical skills were invaluable to the success of this project.',
      'The system that Aarron designed streamlined and digitized a manual process for approving staff expenses. It generates individual logs that reflect expense history, allowing staff members to check their remaining balance. By utilizing Power Automate, he has transformed the manual process of keeping track of each and every staff expense into an efficient workflow, significantly reducing time-consuming, repetitive, and tedious tasks. As a result, the department has saved considerable time that was previously spent manually tracking records.',
      'We believe that Aarron has a bright future ahead of him, and we are confident that he will excel in his future academic pursuits.',
    ],
    author: 'Teo Hwee Sim',
    title: 'Senior Manager · NUS Mathematics',
    when: '14 Feb 2025',
  },
];
