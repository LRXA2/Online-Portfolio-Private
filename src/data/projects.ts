export type Category = 'internship' | 'personal' | 'year1' | 'year2' | 'others' | 'hackathon';

interface ProjectBase {
  slug: string;          // anchor-safe id, unique across all projects
  name: string;
  year: string;          // '2025' | '2024–2025' | 'Aug 2024 – present'
  category: Category;
  blurb: string;
  stack: string[];
  repo?: string;         // absolute GitHub URL; omit when none
  experimental?: boolean;
  materialsNote?: string;
  experienceLink?: { path: string; label: string };

  event?: string;
  eventUrl?: string;
}

export interface ProjectDetail {
  label: string;
  eyebrow: string;
  workflowLabel: string;
  workflowTitle: string;
  steps: string[];
  caption: string;
  pipeline?: {
    title: string;
    input: string;
    branches: { title: string; body: string }[];
    stages: { title: string; body: string }[];
    example: { query: string; filters: string[]; result: string; explanation: string };
  };
  recognition?: { label: string; year: string; title: string; body: string; url: string; linkLabel: string };
  galleries?: { title: string; description: string; images: { src: string; alt: string; caption: string; width: number; height: number }[] }[];
  mediaCredit?: string;
  notes: { label: string; title: string; body: string }[];
}

// Highlight selection does not require a public dossier.
export type Project = ProjectBase & {
  featured?: boolean;
  detail?: ProjectDetail;
};

export const projectData: Project[] = [
  // ---- [01] Internship — Sembcorp (2024–2025) ----
  {
    slug: 'project-crystal',
    name: 'Project Crystal',
    year: '2025',
    category: 'internship',
    featured: true,
    materialsNote: 'Code and data are proprietary to Sembcorp.',
    experienceLink: { path: 'experience#sembcorp', label: 'View experience' },
    blurb: 'Solar-irradiance forecasting, taken end-to-end — EDA, ETL, feature selection, modelling — over spatial and temporal irradiance drivers. A strong proof-of-concept got it adopted as an official company initiative; forecasts now serve Business Development (customer solar-site queries, liquidated-damages risk) and O&M (cleaning/maintenance scheduling).',
    stack: ['Python', 'Azure Synapse', 'Azure Data Explorer', 'KQL', 'Grafana'],
  },
  {
    slug: 'solarizable-roof-detection',
    name: 'Solarizable Roof Detection',
    year: '2025',
    category: 'internship',
    blurb: 'Geospatial pipeline to identify solarizable rooftops across Singapore. Google Open Buildings for rooftop extraction, roof-size filtering to shortlist viable sites, and Google Maps API to enrich each site with address, tenant, and building type for feasibility analysis and solar lead generation.',
    stack: ['Python', 'Google Open Buildings', 'Google Maps API', 'Geospatial'],
  },
  {
    slug: 'pangu-weather',
    name: 'Pangu Weather Experiment',
    year: '2024',
    category: 'internship',
    blurb: 'Explored the Pangu weather model for long-range forecasting, implementing an autoregressive loop to extend the prediction horizon beyond the default output.',
    stack: ['Python', 'Pangu-Weather'],
  },
  {
    slug: 'forecast-model-evaluation',
    name: 'Forecast Model Evaluation',
    year: '2024',
    category: 'internship',
    blurb: 'Benchmarked in-house forecasting models against third-party forecasts, using Seaborn for visual analysis and performance comparison.',
    stack: ['Python', 'Seaborn'],
  },
  {
    slug: 'grafana-kql-migration',
    name: 'Grafana → KQL Migration',
    year: '2024',
    category: 'internship',
    blurb: 'Migrated dashboards from SQL to KQL, including pipeline adjustments for changed data ingestion and transformation logic.',
    stack: ['KQL', 'SQL', 'Grafana', 'Azure'],
  },

  // ---- [02] Personal ----
  {
    slug: 'personal-rag',
    featured: true,
    detail: {
      label: 'Project dossier',
      eyebrow: 'PERSONAL BUILD / RETRIEVAL SYSTEM',
      workflowLabel: '01 / RETRIEVAL ARCHITECTURE',
      workflowTitle: 'Broad discovery. Selective reading.',
      steps: ['Index metadata', 'Retrieve candidates', 'Fuse & rank', 'Check policy', 'Optional content grounding'],
      caption: 'Architecture based on the repository. Semantic retrieval depends on model availability; the local LLM planner and cross-encoder reranker are optional.',
      pipeline: {
        title: 'Three search signals. One shortlist.',
        input: 'Query + file metadata',
        branches: [
          { title: 'Lexical', body: 'Direct filename and path matches' },
          { title: 'BM25', body: 'Exact terms across metadata' },
          { title: 'Semantic', body: 'Related meanings via metadata vectors' },
        ],
        stages: [
          { title: 'Combine', body: 'Weighted reciprocal rank fusion merges candidate lists.' },
          { title: 'Refine', body: 'Coverage checks and heuristic ranking; optional cross-encoder, then folder expansion.' },
          { title: 'Return or read', body: 'Return matching files, or check policy before optional content extraction.' },
        ],
        example: {
          query: 'Find the Atlas onboarding video from March',
          filters: ['Project: Atlas', 'Topic: onboarding', 'Type: video', 'Date: March'],
          result: 'Filename + folder + date + file type',
          explanation: 'Illustrative query from the README. Metadata can identify a matching video without opening it or generating a transcript. These are conceptual query cues, not a captured result or benchmark.',
        },
      },
      notes: [
        { label: '02 / DESIGN CHOICE', title: 'Start with the file catalogue.', body: 'Names, path breadcrumbs, types, and dates provide the first search surface. Folder summaries add context from child filenames. Content reading is a separate stage after candidate selection.' },
        { label: '03 / RANKING', title: 'Keep exact matches in the mix.', body: 'BM25 anchors multi-word searches while semantic retrieval accommodates different wording. Query-coverage checks reduce candidates that match just one term. Ranking also considers path, recency, and file-type signals.' },
        { label: '04 / ACCESS CONTROLS', title: 'The service controls file access.', body: 'Configured roots, blocked directories, filename patterns, extension rules, and reading limits constrain retrieval and content access. The optional language model plans a query; it does not directly open files.' },
        { label: '05 / IMPLEMENTATION', title: 'Local search, reusable interfaces.', body: 'Python retrieval is exposed through FastAPI and a browser UI. Metadata embeddings can persist in a SQLite cache. A rule-based planner remains available if the optional local model cannot load or its output cannot be parsed.' },
      ],
    },
    name: 'Personal-RAG',
    year: '2025',
    category: 'personal',
    repo: 'https://github.com/LRXA2/Personal-RAG',
    blurb: 'Metadata-first, two-stage file search. Hybrid lexical + BM25 + vector retrieval fused with weighted RRF, cross-encoder reranking, and a safety-policy layer — served over FastAPI.',
    stack: ['Python', 'FastAPI', 'BM25', 'Vector + RRF', 'Cross-encoder'],
  },
  {
    slug: 'reminder-agent',
    featured: true,
    detail: {
      label: 'Project dossier',
      eyebrow: 'PERSONAL BUILD',
      workflowLabel: '01 / VISUAL PLACEHOLDER',
      workflowTitle: 'An example, from input to reminder.',
      steps: ['Image, PDF or audio', 'Draft for review', 'Confirmed reminder'],
      caption: 'Illustrative workflow based on the project summary. A real screenshot or demo will replace this placeholder.',
      notes: [
        { label: '02 / EXAMPLE PLACEHOLDER', title: 'See it in use.', body: 'A worked example will go here, showing the source material, the proposed reminder, and the confirmation step.' },
        { label: '03 / DETAILS PLACEHOLDER', title: 'Behind the build.', body: 'Space for the implementation approach, design decisions, graphics, and verified results.' },
      ],
    },
    name: 'Reminder Agent',
    year: '2025',
    category: 'personal',
    repo: 'https://github.com/LRXA2/reminder-agent-public',
    blurb: 'Multimodal Telegram planning bot: images, PDFs, and audio become reminder drafts you confirm before they save. SQLite-backed, with two-way Google Calendar sync and Gmail triage.',
    stack: ['Python', 'SQLite', 'Telegram API', 'Google Calendar', 'Gmail'],
  },
  {
    slug: 'stock-forecast',
    name: 'Stock Forecast',
    year: '2025',
    category: 'personal',
    repo: 'https://github.com/LRXA2/Stock-Forecast-Public',
    blurb: 'Integrates daily stock data with annual financial reports for energy companies to forecast short-term price movements. Cleaning, currency normalization, lagged features (energy type, cross-company), and R/VIF de-correlation feed a regression suite with time-series-aware validation over 1- and 3-month horizons.',
    stack: ['Python', 'R', 'scikit-learn', 'VIF'],
  },
  {
    slug: 'attrition-risk-classifier',
    name: 'Attrition-Risk Classifier',
    year: '2026',
    category: 'personal',
    repo: 'https://github.com/LRXA2/IBM-HR-Analytics-Employee-Attrition-Performance',
    blurb: 'Attrition-risk classifier on the Kaggle IBM HR Analytics dataset, using pre-hire-only features to prevent leakage and inform hiring/onboarding. EDA and feature engineering, linear models plus Naive Bayes with stratified splits; PR-AUC/ROC-AUC evaluation and F2 threshold optimization to prioritize recall.',
    stack: ['Python', 'scikit-learn'],
  },
  {
    slug: 'medi-assist',
    event: 'Singapore Polytechnic',
    name: 'Medi Assist',
    year: '2023',
    category: 'hackathon',
    repo: 'https://github.com/moustacheManHere/TryHacks2023',
    blurb: 'Web app: photograph a medicine label and get relevant information scraped from medical sites. Image-to-text API plus BeautifulSoup scraping; Next.js/Tailwind frontend, Flask backend, containerized with Docker, deployed on Vercel.',
    stack: ['Next.js', 'Tailwind', 'Flask', 'Docker', 'Vercel'],
  },
  {
    slug: 'vscode-ollama-chat',
    name: 'VS Code Ollama Chat',
    year: '2025',
    category: 'personal',
    experimental: true,
    repo: 'https://github.com/LRXA2/VSCode-LLM-Chat',
    blurb: 'VS Code extension to chat with local Ollama LLMs in-editor. Custom Webview UI, streamed responses, stop/cancel via AbortController, and GPU/Ollama startup checks.',
    stack: ['TypeScript', 'VS Code API', 'Ollama'],
  },
  {
    slug: 'mcp-server',
    name: 'Project-Control MCP Server',
    year: '2025',
    category: 'personal',
    experimental: true,
    repo: 'https://github.com/LRXA2/project-manager-mcp-server',
    blurb: 'Python MCP server for project operations: safe file tools, cross-platform shell execution, Git integration, and local context management. Built on FastMCP with audit logging, staging for locked files, and destructive-action guardrails.',
    stack: ['Python', 'FastMCP'],
  },

  {
    slug: 'garena-hackathon',
    featured: true,
    detail: {
      label: 'Hackathon dossier',
      recognition: {
        label: 'Featured team / Garena AI Build Challenge',
        year: '2026',
        title: 'Featured team at Garena AI Build Challenge 2026',
        body: 'Our team, Cooked, is featured on the official challenge website for our collaborative esports creation concept. I took part as team captain, working with a five-person team to turn broadcast breaks into a shared creative experience.',
        url: 'https://aibuildchallenge.garena.sg/featured-teams.html',
        linkLabel: 'See Cooked on the featured teams page',
      },
      galleries: [
      {
            "title": "The starting point. The shared result.",
            "description": "One documented prototype run, using synthetic audience messages. The final image is one of four generated candidates, shown alongside the original character.",
            "images": [
                  {
                        "src": "assets/images/garena/original.png",
                        "alt": "Original Helen character artwork used as the input to the demo",
                        "caption": "Original / character input",
                        "width": 768,
                        "height": 768
                  },
                  {
                        "src": "assets/images/garena/final.png",
                        "alt": "Generated Helen emote combining a happy expression, raised cheering fist, crown, and ice blue and silver colours",
                        "caption": "Final / candidate 01",
                        "width": 768,
                        "height": 768
                  }
            ]
      },
      {
            "title": "Four choices, shaped by the audience.",
            "description": "The demo records these selected options from a set of 16 generated component images. Each option changes one aspect of the original before the winning parts are combined.",
            "images": [
                  {
                        "src": "assets/images/garena/expression.png",
                        "alt": "Helen with the selected happy expression",
                        "caption": "Expression / happy",
                        "width": 768,
                        "height": 768
                  },
                  {
                        "src": "assets/images/garena/action.png",
                        "alt": "Helen with a raised fist in a cheering pose",
                        "caption": "Action / cheering",
                        "width": 1024,
                        "height": 1024
                  },
                  {
                        "src": "assets/images/garena/accessory.png",
                        "alt": "Helen wearing the selected gold crown",
                        "caption": "Accessory / crown",
                        "width": 1024,
                        "height": 1024
                  },
                  {
                        "src": "assets/images/garena/palette.png",
                        "alt": "Helen recoloured in ice blue and silver",
                        "caption": "Palette / ice blue & silver",
                        "width": 1024,
                        "height": 1024
                  }
            ]
      }
],
      mediaCredit: 'Demo artwork: Helen from Arena of Valor. The character, source artwork, and generated derivatives belong to their respective rights holders. Shown here to document the Garena hackathon prototype; no ownership of the artwork is claimed.',
      eyebrow: 'HACKATHON / TEAM COOKED',
      workflowLabel: '01 / AUDIENCE WORKFLOW',
      workflowTitle: 'From audience ideas to a shared emote.',
      steps: ['Submit ideas', 'Group & generate options', 'Vote on components', 'Blend & host review', 'Reveal the emote'],
      caption: 'Workflow diagram of the hackathon prototype. Viewers contribute expressions, actions, accessories, and colour palettes; the host reviews the final candidates before revealing the result.',
      notes: [
        { label: '02 / THE CHALLENGE', title: 'Make the intermission part of the show.', body: 'Built for the Garena AI Build Challenge 2026 theme, Reimagine Digital Entertainment Experiences. The prototype gives viewers a shared creative activity during the quiet gaps between esports matches.' },
        { label: '03 / MY ROLE', title: 'Team captain, Team Cooked.', body: 'I served as team captain alongside Lhanxi, Darrel, bright545, and Benjamin Yeoh. Together, we built a prototype connecting participant, host, and broadcast views.' },
        { label: '04 / THE AI PIPELINE', title: 'Ideas become visual choices.', body: 'Audience suggestions are grouped by meaning and translated into four prompts per component. Each prompt limits the edit: expression changes preserve the pose and outfit; accessory changes preserve the anatomy; palette changes preserve skin tone. The chosen components feed the blending stage, with Ollama and ComfyUI supporting local interpretation and image generation.' },
        { label: '05 / PROTOTYPE EVIDENCE', title: 'A documented generation run.', body: 'The saved run follows synthetic audience messages through interpreted ideas, prompts, 16 visual options, component selections, blend stages, and four final candidates. These artifacts make each stage inspectable. They demonstrate the generation workflow; they are not a measurement of live audience engagement.' },
      ],
    },
    name: 'Garena AI Build 2026',
    year: '2026',
    category: 'hackathon',
    event: 'Garena',
    eventUrl: 'https://aibuildchallenge.garena.sg/index.html#overview',
    repo: 'https://github.com/LRXA2/Garena-AI-Build-2026Garena-AI-Build-2026-Public',
    blurb: 'Team captain of Team Cooked, building a collaborative emote-generation prototype for esports intermissions. AI groups audience ideas by meaning and generates visual options; viewers vote on components that are combined into a final emote for host review. Participant, host, and broadcast views connect the experience, with local inference through Ollama and ComfyUI.',
    stack: ['Python', 'FastAPI', 'Sentence Transformers', 'Ollama', 'ComfyUI', 'React'],
  },

  // ---- [03] School · Year 1 ----
  {
    slug: 'us-housing',
    name: 'US Housing Prices Prediction',
    year: '2022',
    category: 'year1',
    blurb: 'Supervised regression on 545 houses; categorical encoding and skew transforms to improve model performance.',
    stack: ['Python', 'scikit-learn'],
  },
  {
    slug: 'credit-card-default',
    name: 'Credit Card Default Prediction',
    year: '2022',
    category: 'year1',
    blurb: 'Supervised classification over 1,600 customers — demographics, credit limits, bill amounts, payment history — to predict next-month default.',
    stack: ['Python', 'scikit-learn'],
  },
  {
    slug: 'dvd-rentals',
    name: 'DVD Rentals Website',
    year: '2022',
    category: 'year1',
    blurb: 'Full-stack DVD rental site: browse, rent, like, and review titles, with accounts and an admin panel for managing users and listings.',
    stack: ['React', 'Node.js', 'Express', 'MySQL'],
  },
  {
    slug: 'portfolio-site',
    name: 'Portfolio',
    year: '2022',
    category: 'year1',
    blurb: 'Static personal portfolio site showcasing skills, projects, and background.',
    stack: ['Bootstrap', 'CSS'],
  },
  {
    slug: 'sg-transport-eda',
    name: 'SG Transport EDA',
    year: '2022',
    category: 'year1',
    blurb: 'Exploratory data analysis of Singapore public transport with interactive and statistical visualizations.',
    stack: ['Python', 'Plotly', 'Seaborn'],
  },
  {
    slug: 'wordpress-admin',
    name: 'WordPress Admin',
    year: '2022',
    category: 'year1',
    blurb: 'System administration on a local environment: user groups and file/directory permissions for a WordPress installation.',
    stack: ['Linux', 'WordPress'],
  },
  {
    slug: 'customer-segmentation',
    name: 'Customer Segmentation',
    year: '2023',
    category: 'year1',
    blurb: 'Unsupervised clustering of 200 mall customers (gender, age, income, spending) to surface high-value segments for targeted marketing.',
    stack: ['Python', 'scikit-learn'],
  },
  {
    slug: 'utilities-time-series',
    name: 'Utilities Time-Series',
    year: '2023',
    category: 'year1',
    blurb: 'Statsmodels time-series forecast of monthly gas, electricity, and water consumption to support resource planning.',
    stack: ['Python', 'Statsmodels'],
  },
  {
    slug: 'grocery-oltp',
    name: 'Grocery Store OLTP',
    year: '2023',
    category: 'year1',
    blurb: 'Relational OLTP database for a grocery store — inventory, employees, customers, transactions — with an ERD, a normalized schema, and complex SQL reporting.',
    stack: ['SQL', 'ERD'],
  },

  // ---- [04] School · Year 2 ----
  {
    slug: 'vegetable-cnn',
    name: 'Vegetable CNN',
    year: '2023',
    category: 'year2',
    blurb: 'Multi-class vegetable image classification across 15 categories, with CNNs trained at 31×31 and 128×128 to compare performance across resolutions.',
    stack: ['Python', 'TensorFlow', 'CNN'],
  },
  {
    slug: 'next-word-rnn',
    name: 'Next-Word RNN',
    year: '2023',
    category: 'year2',
    blurb: 'RNN that predicts the next word in a quote; tokenized quote data trains a sequence model for contextually relevant completions.',
    stack: ['Python', 'TensorFlow', 'RNN'],
  },
  {
    slug: 'caesar-cipher',
    name: 'Caesar Cipher Library',
    year: '2023',
    category: 'year2',
    blurb: 'Reusable, modular Caesar cipher encrypt/decrypt library built with OOP principles for easy integration.',
    stack: ['Python', 'OOP'],
  },
  {
    slug: 'driver-etl',
    name: 'Driver Data ETL',
    year: '2023',
    category: 'year2',
    blurb: 'Team analytics for a fictional ride-hailing company: CSV into a SQL database, analyzed via SQLAlchemy with outlier removal, interpolation, and feature engineering; insights visualized in Tableau.',
    stack: ['Python', 'SQLAlchemy', 'SQL', 'Tableau'],
  },
  {
    slug: 'computer-co-mongodb',
    name: 'Computer Co. MongoDB',
    year: '2023',
    category: 'year2',
    blurb: 'MongoDB analysis of accessory data: JSON import into collections and aggregation queries for unsold products, stock distribution, and warehouse-level metrics.',
    stack: ['MongoDB'],
  },
  {
    slug: 'computer-co-olap',
    name: 'Computer Co. OLAP/ETL',
    year: '2023',
    category: 'year2',
    blurb: 'Data warehouse in Microsoft SQL Server: extract from multiple formats (CSV, TSV, Excel, JSON, SQL, TXT), ETL into a star schema, and reporting queries for sales, trends, profitability, and inventory.',
    stack: ['MSSQL', 'ETL', 'Star schema'],
  },
  {
    slug: 'cifar10-gan',
    name: 'CIFAR-10 GAN',
    year: '2024',
    category: 'year2',
    blurb: 'GAN trained on CIFAR-10; adversarial generator/discriminator learning produces realistic 32×32 color images across the 10 classes.',
    stack: ['Python', 'TensorFlow', 'GAN'],
  },
  {
    slug: 'pendulum-dqn',
    name: 'Pendulum DQN',
    year: '2024',
    category: 'year2',
    blurb: 'Deep Q-Network on the OpenAI Gym Pendulum environment, learning a value-based control policy through trial-and-error interaction.',
    stack: ['Python', 'DQN', 'OpenAI Gym'],
  },
  {
    slug: 'math-parse-tree',
    name: 'Math Parse Tree',
    year: '2024',
    category: 'year2',
    blurb: 'Parses mathematical expressions into trees for structured representation and evaluation via traversal — data structures, algorithms, and OOP.',
    stack: ['Python', 'OOP'],
  },
  {
    slug: 'vegetable-deploy',
    name: 'Vegetable Deploy',
    year: '2024',
    category: 'year2',
    blurb: 'Built and deployed TensorFlow CNN models with Docker, Flask, TensorFlow Serving, and Render; PyTest for testing; Agile DevOps with GitLab CI/CD.',
    stack: ['TensorFlow', 'Docker', 'Flask', 'TF Serving', 'Render'],
  },
  {
    slug: 'cab-trips-classifier',
    name: 'Cab Trips Classifier',
    year: '2024',
    category: 'year2',
    blurb: 'End-to-end team data science project classifying cab trips as dangerous or not. Scrum workflow; ingestion, preprocessing, SMOTE balancing, and a Logistic Regression model deployed via a Tkinter app, tracked with MLflow and persisted with pickle.',
    stack: ['Python', 'scikit-learn', 'SMOTE', 'MLflow'],
  },

  // ---- [05] Others ----
  {
    slug: 'nus-math-automation',
    name: 'NUS Math Dept Automation',
    year: '2023',
    category: 'others',
    blurb: 'Optimized operational processes with Power Automate: automated teaching-point redemption fund management, Educator Track funding expense tracking, and overseas PhD financial support.',
    stack: ['Power Automate', 'Microsoft Suite'],
  },
];

export const featuredProjects = projectData.filter(project => project.featured === true);
