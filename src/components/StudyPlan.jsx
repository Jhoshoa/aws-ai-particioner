import { useState } from "react";

const domains = [
  {
    id: 1,
    name: "Fundamentals of AI & ML",
    weight: 20,
    color: "#00D4FF",
    weeks: "1–2",
    topics: [
      "AI vs ML vs Deep Learning definitions",
      "Supervised, Unsupervised, Reinforcement Learning",
      "Training, validation, test datasets",
      "Overfitting, underfitting, bias-variance tradeoff",
      "Model evaluation metrics (accuracy, precision, recall, F1, AUC)",
      "Common ML algorithms (regression, classification, clustering)",
      "Neural networks & deep learning basics",
      "AWS ML stack overview: SageMaker, Rekognition, Comprehend, Polly, Transcribe, Translate",
      "Data preprocessing & feature engineering",
      "MLOps concepts",
    ],
  },
  {
    id: 2,
    name: "Fundamentals of Generative AI",
    weight: 24,
    color: "#FF6B35",
    weeks: "3–4",
    topics: [
      "What is Generative AI & Large Language Models (LLMs)",
      "Transformers architecture basics",
      "Tokens, embeddings, context windows",
      "Prompt engineering techniques (zero-shot, few-shot, chain-of-thought)",
      "Temperature, top-p, top-k parameters",
      "Hallucinations and mitigation strategies",
      "Text-to-image, text-to-video, multimodal models",
      "Amazon Bedrock overview & foundation models",
      "Amazon Titan models",
      "Anthropic Claude, Meta Llama, Mistral on Bedrock",
      "Amazon Q Business & Developer",
      "AWS PartyRock",
    ],
  },
  {
    id: 3,
    name: "Applications of Foundation Models",
    weight: 28,
    color: "#FFD700",
    weeks: "5–7",
    topics: [
      "RAG (Retrieval-Augmented Generation) architecture",
      "Amazon Bedrock Knowledge Bases",
      "Vector databases & embeddings (Amazon OpenSearch, Aurora pgvector)",
      "Fine-tuning vs RAG vs prompt engineering trade-offs",
      "Amazon Bedrock Agents",
      "Amazon Bedrock Guardrails",
      "Model customization: fine-tuning, continued pre-training",
      "Inference parameters and their effects",
      "Cost optimization for FM usage",
      "Choosing the right foundation model for a use case",
      "Amazon SageMaker JumpStart",
      "Integration patterns with AWS services",
    ],
  },
  {
    id: 4,
    name: "Guidelines for Responsible AI",
    weight: 14,
    color: "#00FF88",
    weeks: "8",
    topics: [
      "Fairness, bias, and discrimination in AI",
      "Transparency and explainability (XAI)",
      "AWS AI Service Cards",
      "Human-in-the-loop (HITL) design",
      "Amazon SageMaker Clarify",
      "Model fairness metrics",
      "Environmental impact of AI",
      "AWS Responsible AI principles",
      "Identifying and mitigating AI risks",
      "Ethical use cases and red flags",
    ],
  },
  {
    id: 5,
    name: "Security, Compliance & Governance",
    weight: 14,
    color: "#FF4D8D",
    weeks: "9",
    topics: [
      "AWS IAM for AI/ML services",
      "Data encryption at rest and in transit",
      "Amazon Macie for data classification",
      "AWS PrivateLink & VPC endpoints for AI services",
      "Compliance frameworks (GDPR, HIPAA) in AI context",
      "AWS Artifact for compliance reports",
      "Amazon Bedrock data privacy & model isolation",
      "Audit logging with AWS CloudTrail",
      "AWS Config for AI resource governance",
      "Data lineage and provenance",
    ],
  },
];

const studyPlan = [
  { week: 1, phase: "Foundation", domain: 1, daily: ["Read AWS AI/ML overview docs (20 min)", "Watch 1 SageMaker intro video (20 min)", "Take notes in your repo (20 min)"], milestone: "Understand the AI/ML landscape" },
  { week: 2, phase: "Foundation", domain: 1, daily: ["Study ML algorithms & metrics (20 min)", "AWS Free Tier: explore SageMaker Studio (20 min)", "Practice 10 questions on Domain 1 (20 min)"], milestone: "Score 70%+ on Domain 1 mock" },
  { week: 3, phase: "GenAI Core", domain: 2, daily: ["Study LLM concepts & transformers (20 min)", "Explore Amazon Bedrock console (20 min)", "Take notes + 10 practice Qs (20 min)"], milestone: "Understand GenAI fundamentals" },
  { week: 4, phase: "GenAI Core", domain: 2, daily: ["Deep dive: prompt engineering (20 min)", "Hands-on: Amazon Q / PartyRock (20 min)", "Practice 15 questions Domain 2 (20 min)"], milestone: "Score 70%+ on Domain 2 mock" },
  { week: 5, phase: "Applications", domain: 3, daily: ["Study RAG architecture (20 min)", "Explore Bedrock Knowledge Bases (20 min)", "Diagram RAG flow in notes (20 min)"], milestone: "Explain RAG end-to-end" },
  { week: 6, phase: "Applications", domain: 3, daily: ["Study Bedrock Agents & Guardrails (20 min)", "Read fine-tuning vs RAG comparison (20 min)", "20 practice Qs Domain 3 (20 min)"], milestone: "Master Domain 3 concepts" },
  { week: 7, phase: "Applications", domain: 3, daily: ["Review model selection criteria (20 min)", "Cost & latency optimization review (20 min)", "Full Domain 3 mock test (20 min)"], milestone: "Score 75%+ on Domain 3 mock" },
  { week: 8, phase: "Responsible AI", domain: 4, daily: ["Study responsible AI principles (20 min)", "Review SageMaker Clarify docs (20 min)", "10 practice Qs + notes (20 min)"], milestone: "Know all AWS responsible AI tools" },
  { week: 9, phase: "Security", domain: 5, daily: ["Study IAM, encryption for AI (20 min)", "Review compliance + Bedrock privacy (20 min)", "15 practice Qs Domain 5 (20 min)"], milestone: "Score 70%+ on Domains 4+5" },
  { week: 10, phase: "Full Review", domain: null, daily: ["Full 65-question mock exam (30 min)", "Review wrong answers deeply (20 min)", "Re-read weak domain notes (10 min)"], milestone: "Score 750+ on full mock" },
  { week: 11, phase: "Exam Prep", domain: null, daily: ["Second full mock exam (30 min)", "Flashcard review (15 min)", "AWS whitepapers skim (15 min)"], milestone: "Consistent 800+ score" },
  { week: 12, phase: "Final Push", domain: null, daily: ["Light review of all domain summaries (30 min)", "Rest + confidence building (15 min)", "Schedule & take the exam! 🎯"], milestone: "PASS AIF-C01! 🏆" },
];

const resources = [
  { type: "FREE", name: "Andrew Brown – FreeCodeCamp 15hr Course", url: "https://youtube.com", note: "Best free full course, by AWS Community Hero" },
  { type: "PAID", name: "Stephane Maarek – Udemy Course", url: "https://udemy.com", note: "~$15 on sale. Most popular paid option" },
  { type: "PRACTICE", name: "Tutorials Dojo AIF-C01 Practice Exams", url: "https://tutorialsdojo.com", note: "135 Qs, section-based & timed modes" },
  { type: "PRACTICE", name: "Stephane Maarek Practice Tests (Udemy)", url: "https://udemy.com", note: "260 Qs, co-authored with Abhishek Singh" },
  { type: "FREE", name: "AWS Skill Builder – Official Course", url: "https://skillbuilder.aws", note: "Official AWS content, free tier available" },
  { type: "FREE", name: "ExamTopics AIF-C01 (free Qs)", url: "https://examtopics.com", note: "20 free questions + community discussions" },
  { type: "OFFICIAL", name: "AWS Official Exam Guide AIF-C01", url: "https://docs.aws.amazon.com/aws-certification/latest/examguides/ai-practitioner-01.html", note: "Read this FIRST — defines exact scope" },
];

const repoStructure = `aws-ai-practitioner-aif-c01/
│
├── README.md                    # Overview, progress tracker, links
├── EXAM-INFO.md                 # Exam details, scoring, tips
│
├── domain-1-ai-ml-fundamentals/
│   ├── README.md
│   ├── 01-ai-ml-overview.md
│   ├── 02-ml-algorithms.md
│   ├── 03-model-evaluation.md
│   ├── 04-aws-ml-services.md
│   └── practice-questions.md
│
├── domain-2-generative-ai/
│   ├── README.md
│   ├── 01-llm-fundamentals.md
│   ├── 02-prompt-engineering.md
│   ├── 03-amazon-bedrock.md
│   ├── 04-amazon-q.md
│   └── practice-questions.md
│
├── domain-3-foundation-models/
│   ├── README.md
│   ├── 01-rag-architecture.md
│   ├── 02-bedrock-knowledge-bases.md
│   ├── 03-bedrock-agents.md
│   ├── 04-fine-tuning.md
│   ├── 05-model-selection.md
│   └── practice-questions.md
│
├── domain-4-responsible-ai/
│   ├── README.md
│   ├── 01-fairness-bias.md
│   ├── 02-explainability.md
│   ├── 03-sagemaker-clarify.md
│   └── practice-questions.md
│
├── domain-5-security-governance/
│   ├── README.md
│   ├── 01-iam-for-ai.md
│   ├── 02-data-protection.md
│   ├── 03-compliance.md
│   └── practice-questions.md
│
├── cheat-sheets/
│   ├── aws-services-quick-ref.md
│   ├── key-terms-glossary.md
│   └── exam-day-tips.md
│
└── mock-exams/
    ├── full-mock-01-results.md
    └── full-mock-02-results.md`;

export default function StudyPlan() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [copiedRepo, setCopiedRepo] = useState(false);

  const phaseColors = {
    Foundation: "#00D4FF",
    "GenAI Core": "#FF6B35",
    Applications: "#FFD700",
    "Responsible AI": "#00FF88",
    Security: "#FF4D8D",
    "Full Review": "#A78BFA",
    "Exam Prep": "#A78BFA",
    "Final Push": "#FFD700",
  };

  const copyRepo = () => {
    navigator.clipboard.writeText(repoStructure);
    setCopiedRepo(true);
    setTimeout(() => setCopiedRepo(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050A14",
      color: "#E8EDF5",
      fontFamily: "'DM Mono', 'Courier New', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&family=DM+Sans:wght@300;400;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A1525; }
        ::-webkit-scrollbar-thumb { background: #00D4FF44; border-radius: 2px; }
        .tab-btn { transition: all 0.2s; cursor: pointer; }
        .tab-btn:hover { opacity: 0.9; }
        .week-card { transition: all 0.25s; cursor: pointer; }
        .week-card:hover { transform: translateX(4px); }
        .domain-card { transition: all 0.2s; cursor: pointer; }
        .domain-card:hover { opacity: 0.9; transform: scale(1.01); }
        .resource-row { transition: background 0.15s; }
        .resource-row:hover { background: #0A1F35 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .glow { box-shadow: 0 0 20px #00D4FF22; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "40px 32px 0", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#00D4FF", marginBottom: 8, fontFamily: "'DM Mono'" }}>AWS CERTIFICATION ROADMAP</div>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(42px, 7vw, 72px)", letterSpacing: 2, margin: 0, lineHeight: 1, color: "#FFFFFF" }}>
              AI PRACTITIONER
            </h1>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: 3, color: "#00D4FF", marginTop: 2 }}>AIF-C01 · 12-WEEK BATTLE PLAN</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "65 Questions", icon: "?" },
              { label: "90 Minutes", icon: "⏱" },
              { label: "Score 700+", icon: "🎯" },
              { label: "1hr/day", icon: "📅" },
            ].map(({ label, icon }) => (
              <div key={label} style={{ background: "#0A1525", border: "1px solid #1A2F45", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ fontSize: 11, color: "#8AACCA", marginTop: 2, whiteSpace: "nowrap" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Advantage banner */}
        <div style={{ marginTop: 20, padding: "12px 16px", background: "#0A1F10", border: "1px solid #00FF8833", borderRadius: 8, fontSize: 13, color: "#00FF88" }}>
          ✅ Cloud Practitioner certified — you already know AWS core services. Focus on AI/ML concepts & Bedrock. You can do this in 10–12 weeks.
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 28, borderBottom: "1px solid #1A2F45" }}>
          {["overview", "domains", "schedule", "resources", "repo"].map(tab => (
            <button
              key={tab}
              className="tab-btn"
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#00D4FF" : "transparent",
                color: activeTab === tab ? "#050A14" : "#8AACCA",
                border: "none",
                padding: "10px 18px",
                borderRadius: "6px 6px 0 0",
                fontSize: 12,
                fontFamily: "'DM Mono'",
                letterSpacing: 1,
                fontWeight: activeTab === tab ? 500 : 400,
                textTransform: "uppercase",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 32px 60px" }} className="fade-in" key={activeTab}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
              {domains.map(d => (
                <div key={d.id} style={{ background: "#0A1525", border: `1px solid ${d.color}44`, borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: d.color, letterSpacing: 2 }}>DOMAIN {d.id}</span>
                    <span style={{ background: d.color + "22", color: d.color, fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 20, fontFamily: "'DM Mono'" }}>{d.weight}%</span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 15, color: "#E8EDF5", marginBottom: 8 }}>{d.name}</div>
                  <div style={{ height: 4, background: "#1A2F45", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: d.weight * 3.5 + "%", background: d.color, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#8AACCA", marginTop: 8 }}>Weeks {d.weeks} · {d.topics.length} topics</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#0A1525", border: "1px solid #1A2F45", borderRadius: 10, padding: "20px 24px" }}>
              <div style={{ fontSize: 11, color: "#00D4FF", letterSpacing: 3, marginBottom: 14 }}>EXAM STRATEGY</div>
              {[
                ["Domain 3 is worth 28%", "Applications of Foundation Models is the biggest domain — master RAG, Bedrock Agents, and Guardrails."],
                ["Domains 1+2 = 44% together", "Strong AI/ML + GenAI fundamentals will carry almost half your score."],
                ["Domains 4+5 = quick wins", "Only 14% each, but highly learnable in a short time. Don't skip them."],
                ["You need 700/1000 to pass", "That's about 46/65 questions correct. Practice tests are key."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #1A2F4530" }}>
                  <div style={{ color: "#00D4FF", fontSize: 16, flexShrink: 0, marginTop: 1 }}>→</div>
                  <div>
                    <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, color: "#E8EDF5" }}>{title}: </span>
                    <span style={{ fontSize: 13, color: "#8AACCA" }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOMAINS */}
        {activeTab === "domains" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {domains.map(d => (
              <div key={d.id} className="domain-card" style={{ background: "#0A1525", border: `1px solid ${expandedDomain === d.id ? d.color : "#1A2F45"}`, borderRadius: 10, overflow: "hidden" }}
                onClick={() => setExpandedDomain(expandedDomain === d.id ? null : d.id)}>
                <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: d.color + "22", border: `1px solid ${d.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: d.color, fontFamily: "'Bebas Neue'", fontSize: 18 }}>{d.id}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 15 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "#8AACCA" }}>Weeks {d.weeks}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: d.color, fontFamily: "'Bebas Neue'", fontSize: 22 }}>{d.weight}%</span>
                    <span style={{ color: "#8AACCA", fontSize: 18 }}>{expandedDomain === d.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expandedDomain === d.id && (
                  <div style={{ borderTop: `1px solid ${d.color}33`, padding: "16px 20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                      {d.topics.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#C5D4E8", padding: "6px 0" }}>
                          <span style={{ color: d.color, flexShrink: 0, marginTop: 1, fontSize: 10 }}>◆</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === "schedule" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {studyPlan.map(({ week, phase, domain, daily, milestone }) => {
              const phaseColor = phaseColors[phase] || "#00D4FF";
              const isExpanded = expandedWeek === week;
              return (
                <div key={week} className="week-card"
                  style={{ background: "#0A1525", border: `1px solid ${isExpanded ? phaseColor : "#1A2F45"}`, borderRadius: 10, overflow: "hidden" }}
                  onClick={() => setExpandedWeek(isExpanded ? null : week)}>
                  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ minWidth: 44, height: 44, borderRadius: 8, background: phaseColor + "22", border: `1px solid ${phaseColor}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 9, color: phaseColor, letterSpacing: 1 }}>WK</div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: phaseColor, lineHeight: 1 }}>{week}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14 }}>{phase}</span>
                        {domain && <span style={{ fontSize: 11, color: phaseColor, background: phaseColor + "15", padding: "2px 8px", borderRadius: 10 }}>Domain {domain}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#8AACCA", marginTop: 2 }}>🎯 {milestone}</div>
                    </div>
                    <span style={{ color: "#8AACCA" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${phaseColor}22`, padding: "14px 18px" }}>
                      <div style={{ fontSize: 11, color: phaseColor, letterSpacing: 2, marginBottom: 10 }}>DAILY SESSIONS (1 HOUR TOTAL)</div>
                      {daily.map((task, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#C5D4E8" }}>
                          <span style={{ color: phaseColor, flexShrink: 0 }}>0{i + 1}.</span>
                          {task}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === "resources" && (
          <div>
            <div style={{ background: "#0A1525", border: "1px solid #1A2F45", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1A2F45", fontSize: 11, color: "#00D4FF", letterSpacing: 3 }}>RECOMMENDED RESOURCES</div>
              {resources.map((r, i) => (
                <div key={i} className="resource-row" style={{ padding: "14px 20px", borderBottom: i < resources.length - 1 ? "1px solid #0D1E30" : "none", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, fontSize: 10, padding: "3px 8px", borderRadius: 4, letterSpacing: 1, fontWeight: 500,
                    background: r.type === "FREE" ? "#00FF8820" : r.type === "PAID" ? "#FF6B3520" : r.type === "PRACTICE" ? "#FFD70020" : "#00D4FF20",
                    color: r.type === "FREE" ? "#00FF88" : r.type === "PAID" ? "#FF6B35" : r.type === "PRACTICE" ? "#FFD700" : "#00D4FF",
                    border: `1px solid ${r.type === "FREE" ? "#00FF8844" : r.type === "PAID" ? "#FF6B3544" : r.type === "PRACTICE" ? "#FFD70044" : "#00D4FF44"}`,
                  }}>{r.type}</span>
                  <div>
                    <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 14, color: "#E8EDF5" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#8AACCA", marginTop: 3 }}>{r.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#0A1525", border: "1px solid #FFD70044", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "#FFD700", letterSpacing: 3, marginBottom: 12 }}>PRACTICE TEST STRATEGY</div>
              {[
                "Start practice tests after Week 4 (not before — study first!)",
                "Use section-based mode for specific domains you're weak on",
                "Target 80%+ before scheduling the real exam",
                "Review EVERY wrong answer — read the official AWS docs linked in explanations",
                "Do at least 2 full timed 65-question mocks before exam day",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "#C5D4E8" }}>
                  <span style={{ color: "#FFD700", flexShrink: 0 }}>→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPO */}
        {activeTab === "repo" && (
          <div>
            <div style={{ marginBottom: 20, padding: "14px 18px", background: "#0A1F10", border: "1px solid #00FF8833", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#00FF88", letterSpacing: 3, marginBottom: 8 }}>GITHUB REPO STRATEGY</div>
              <div style={{ fontSize: 13, color: "#C5D4E8", lineHeight: 1.7 }}>
                One folder per domain. One markdown file per major topic. Write notes in your own words — this doubles as active recall. 
                Share the repo publicly: it becomes proof of learning for recruiters and the AWS community.
              </div>
            </div>

            <div style={{ background: "#0A1525", border: "1px solid #1A2F45", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #1A2F45", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#00D4FF", letterSpacing: 3 }}>REPOSITORY STRUCTURE</span>
                <button onClick={copyRepo} style={{ background: copiedRepo ? "#00FF8820" : "#0D1E30", color: copiedRepo ? "#00FF88" : "#8AACCA", border: `1px solid ${copiedRepo ? "#00FF8844" : "#1A2F45"}`, borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono'" }}>
                  {copiedRepo ? "✓ Copied!" : "Copy"}
                </button>
              </div>
              <pre style={{ padding: "18px 20px", fontSize: 12, color: "#8AACCA", lineHeight: 1.8, overflowX: "auto", margin: 0 }}>
                {repoStructure.split("\n").map((line, i) => {
                  const isFolder = line.includes("/") && !line.includes(".md") && !line.includes("#");
                  const isFile = line.includes(".md") || line.includes(".md");
                  return (
                    <div key={i} style={{ color: isFolder ? "#00D4FF" : isFile ? "#C5D4E8" : "#8AACCA" }}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {[
                { file: "README.md", tip: "Add a progress checklist with checkboxes. Update weekly. Include your exam date as a countdown." },
                { file: "practice-questions.md", tip: "Don't copy questions verbatim from paid materials. Write your OWN questions based on what you studied." },
                { file: "cheat-sheets/", tip: "Summarize all AWS AI services in a table: name, use case, key features. Gold for last-minute review." },
                { file: "mock-exams/", tip: "Log your score, date, weak domains. Track improvement over time — motivating!" },
              ].map(({ file, tip }) => (
                <div key={file} style={{ background: "#0A1525", border: "1px solid #1A2F45", borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontFamily: "'DM Mono'", fontSize: 12, color: "#00D4FF", marginBottom: 6 }}>{file}</div>
                  <div style={{ fontSize: 12, color: "#8AACCA", lineHeight: 1.6 }}>{tip}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
