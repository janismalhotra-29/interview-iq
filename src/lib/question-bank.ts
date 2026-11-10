export interface BankQuestion {
  id: string;
  role: string;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'FAANG';
  category: string;
  question: string;
  expectedConcepts: string[];
  sampleModelAnswer: string;
}

export const QUESTION_BANK: BankQuestion[] = [
  // --- SOFTWARE DEVELOPER / FULL STACK ---
  {
    id: 'q_fe_1',
    role: 'Frontend Developer',
    type: 'Technical',
    difficulty: 'Medium',
    category: 'React Internals & Performance',
    question: 'How does React’s Virtual DOM and Reconciliation algorithm work, and how does the React 18 Fiber architecture enable concurrent rendering?',
    expectedConcepts: [
      'Virtual DOM diffing heuristic (O(n) complexity)',
      'Reconciliation and key prop importance',
      'Fiber tree node structure with child, sibling, and return pointers',
      'Time slicing and interruptible work units',
      'useTransition and startTransition for prioritizing urgent updates'
    ],
    sampleModelAnswer: 'React maintains a lightweight in-memory representation of the actual DOM called the Virtual DOM. When state or props change, React generates a new Virtual DOM tree and performs reconciliation using a heuristic O(n) diffing algorithm. In React 18 Fiber architecture, the reconciliation work is broken down into small units of work represented as Fiber nodes. Fibers contain pointers to child, sibling, and return nodes. This enables concurrent features like time-slicing, where React can pause rendering of low-priority tasks (e.g., via useTransition) to yield back to the main thread for urgent user inputs, avoiding UI freezing.'
  },
  {
    id: 'q_fe_2',
    role: 'Frontend Developer',
    type: 'Technical',
    difficulty: 'Medium',
    category: 'Web Performance & Core Web Vitals',
    question: 'Explain Core Web Vitals (LCP, INP, CLS). What techniques would you use to diagnose and optimize a slow Largest Contentful Paint (LCP)?',
    expectedConcepts: [
      'Largest Contentful Paint (LCP) under 2.5s',
      'Interaction to Next Paint (INP) replacing FID',
      'Cumulative Layout Shift (CLS) under 0.1',
      'Image optimization (WebP/AVIF, responsive srcset, fetchpriority="high")',
      'Critical CSS and SSR / streaming HTML',
      'Eliminating render-blocking resources'
    ],
    sampleModelAnswer: 'Core Web Vitals quantify real-world user experience: LCP measures loading performance (threshold < 2.5s), INP measures overall page responsiveness across user interactions (< 200ms), and CLS measures visual stability (< 0.1). To optimize LCP: 1) Identify the LCP element (e.g. hero banner or heading); 2) Preload critical images with <link rel="preload"> and fetchpriority="high"; 3) Use modern image formats like AVIF/WebP with CDN compression; 4) Minimize render-blocking CSS and JS; 5) Implement edge caching or Server-Side Rendering (SSR) to reduce Time to First Byte (TTFB).'
  },
  {
    id: 'q_be_1',
    role: 'Backend Developer',
    type: 'Technical',
    difficulty: 'Hard',
    category: 'Database Scaling & Concurrency',
    question: 'How do you handle race conditions in high-concurrency payment or inventory updates? Compare Optimistic vs. Pessimistic locking.',
    expectedConcepts: [
      'Race conditions and lost updates',
      'Pessimistic locking with SELECT ... FOR UPDATE',
      'Optimistic locking using version column or timestamp',
      'Database transaction isolation levels (Read Committed, Repeatable Read, Serializable)',
      'Distributed locks using Redis Redlock or ZooKeeper for multi-node systems'
    ],
    sampleModelAnswer: 'In high-concurrency environments like payments, race conditions cause double-spending or overselling. Pessimistic locking uses database row locks (SELECT ... FOR UPDATE) to lock the resource until transaction commit; this guarantees safety but risks lock contention, latency spikes, and deadlocks. Optimistic locking adds a version or timestamp column (UPDATE inventory SET stock = stock - 1, version = version + 1 WHERE id = 123 AND version = current_version). If the version changed, the update fails or retries. Optimistic locking is ideal for read-heavy scenarios with low collision rates. In distributed multi-service architectures, distributed locks via Redis (e.g. Redlock with fencing tokens) or idempotency keys stored in a transactional datastore are recommended.'
  },
  {
    id: 'q_be_2',
    role: 'Backend Developer',
    type: 'Technical',
    difficulty: 'Medium',
    category: 'API Architecture & Security',
    question: 'What are the architectural differences between REST, GraphQL, and gRPC? When would you select each for a production microservices system?',
    expectedConcepts: [
      'REST: HTTP verbs, statelessness, URL resource hierarchy, over/under-fetching issues',
      'GraphQL: Single endpoint, client-defined schema, avoids over-fetching, N+1 query challenge',
      'gRPC: Protocol Buffers, HTTP/2 multiplexing, bidirectional streaming, strongly typed contracts',
      'Internal service-to-service vs. external public API tradeoffs'
    ],
    sampleModelAnswer: 'REST is standard, cacheable via HTTP, and ideal for public-facing developer APIs. However, complex client views often cause multiple network roundtrips or over-fetching. GraphQL allows clients to specify the exact schema shape needed in a single roundtrip, making it great for mobile and frontend aggregators (BFF pattern), though it requires dataloader patterns to solve N+1 queries. gRPC uses Protocol Buffers binary serialization over HTTP/2, offering low latency, compact payload sizes, and bidirectional streaming. In production microservices, gRPC is optimal for inter-service RPC communication, while REST or GraphQL is best suited for public and client gateway layers.'
  },
  {
    id: 'q_fs_1',
    role: 'Full Stack Developer',
    type: 'Technical',
    difficulty: 'Hard',
    category: 'System Design & State Synchronization',
    question: 'Design a real-time collaborative document editing tool (like Google Docs or Notion). How do you handle concurrent conflicts between multiple users?',
    expectedConcepts: [
      'Operational Transformation (OT) vs. Conflict-Free Replicated Data Types (CRDTs)',
      'WebSocket connection pooling & heartbeat mechanism',
      'Local optimistic updates and eventual consistency',
      'Document snapshotting and change delta log persistence',
      'Presence awareness (cursor positions, active user indicators)'
    ],
    sampleModelAnswer: 'For real-time collaborative editing, clients maintain a local document state for instant keystroke rendering and broadcast mutations via WebSockets. To resolve conflicting concurrent edits, we use CRDTs (e.g., Yjs or Automerge) or Operational Transformation (OT). CRDTs are mathematically commutative and converge deterministically on every node without requiring a single centralized master transformation server. The server acts as an efficient relay, persists change vectors/deltas to an append-only log in PostgreSQL or Cassandra, and periodically generates full snapshots in S3/blob storage. Redis Pub/Sub handles message routing across multiple WebSocket server instances.'
  },

  // --- AI / ML & DATA SCIENCE ---
  {
    id: 'q_ai_1',
    role: 'AI/ML Engineer',
    type: 'Technical',
    difficulty: 'Hard',
    category: 'LLMs & Generative AI Systems',
    question: 'Explain Retrieval-Augmented Generation (RAG). What strategies mitigate hallucination, handle chunk boundary issues, and optimize vector retrieval accuracy?',
    expectedConcepts: [
      'RAG pipeline: ingestion, chunking, embedding, vector search, prompt augmentation, LLM inference',
      'Semantic chunking with sliding window and parent-document retrieval',
      'Dense vs. sparse hybrid search (BM25 + Cosine/HNSW embeddings)',
      'Re-ranking models (Cross-encoders like Cohere Rerank or BGE)',
      'Grounding checks, citation verification, and self-reflection loops'
    ],
    sampleModelAnswer: 'RAG augments LLMs with factual external knowledge to mitigate hallucinations and domain obsolescence. Key strategies: 1) Chunking: Avoid fixed character splitting; use recursive or semantic chunking with overlapping windows or Parent-Document Retrieval (searching small chunks but returning the larger parent section for context). 2) Retrieval: Implement hybrid search combining dense semantic embeddings (e.g. text-embedding-3 or BGE) with sparse lexical search (BM25) using Reciprocal Rank Fusion (RRF). 3) Re-ranking: Run retrieved candidates through a Cross-Encoder reranker to score relevance. 4) Guardrails: Enforce strict system prompt constraints (e.g. answer solely based on context) and execute post-generation attribution checks.'
  },
  {
    id: 'q_ds_1',
    role: 'Data Scientist',
    type: 'Technical',
    difficulty: 'Medium',
    category: 'Statistical Modeling & Evaluation',
    question: 'When evaluating a fraud detection model where only 0.1% of transactions are fraudulent, why is Accuracy misleading? What metrics and loss functions would you use?',
    expectedConcepts: [
      'Extreme class imbalance and accuracy paradox (99.9% trivial baseline)',
      'Precision, Recall, F1-Score, and Precision-Recall AUC (PR-AUC vs. ROC-AUC)',
      'Cost-sensitive learning and false negative business penalty',
      'Focal Loss or weighted Cross-Entropy',
      'Resampling techniques (SMOTE, undersampling) and threshold tuning'
    ],
    sampleModelAnswer: 'With 0.1% fraud prevalence, a naive model predicting "not fraud" 100% of the time achieves 99.9% accuracy while catching zero fraudulent transactions. In imbalanced problems, accuracy is uninformative. Instead, we evaluate PR-AUC (Precision-Recall Area Under Curve), Precision (fraction of flagged transactions actually fraudulent), and Recall (fraction of actual fraud caught). We also measure cost-weighted loss, since a False Negative (missed fraud) costs significantly more than a False Positive (customer SMS verification). Loss functions like Focal Loss or class-weighted cross-entropy penalize easy negative examples and focus learning on rare hard positives.'
  },

  // --- HR / BEHAVIORAL QUESTIONS ---
  {
    id: 'q_hr_1',
    role: 'Software Developer',
    type: 'HR',
    difficulty: 'Medium',
    category: 'Conflict Resolution & Teamwork',
    question: 'Tell me about a time when you strongly disagreed with a senior engineer or product manager regarding a technical decision. How did you handle it and what was the outcome?',
    expectedConcepts: [
      'STAR Method: Situation, Task, Action, Result',
      'Objectivity, data-driven arguments, and proof-of-concept benchmarks',
      'Professional communication and respect for hierarchy/product timelines',
      'Commitment to the final decision (Disagree and Commit mentality)',
      'Measurable impact and lessons learned'
    ],
    sampleModelAnswer: 'In my previous project, a senior engineer proposed rebuilding our authentication service using a niche custom cryptographic protocol, while I favored standard OAuth2 with OpenID Connect. Rather than arguing subjectively, I prepared a short tradeoff matrix comparing development velocity, third-party auditability, security compliance, and maintenance overhead. I built a quick 2-hour POC demonstrating the OAuth2 integration with our mobile client. During our tech sync, I presented the evidence respectfully. The senior engineer recognized the compliance and velocity benefits, and we adopted OAuth2, shipping two weeks ahead of schedule with zero security audit findings.'
  },
  {
    id: 'q_hr_2',
    role: 'Software Developer',
    type: 'HR',
    difficulty: 'Medium',
    category: 'Failure & Resilience',
    question: 'Describe a situation where a production incident or bug occurred due to your code. How did you react, what steps did you take, and how did you prevent recurrence?',
    expectedConcepts: [
      'Taking ownership and accountability without blame-shifting',
      'Immediate containment, rollback, and incident communication',
      'Root Cause Analysis (5 Whys / Blameless Post-Mortem)',
      'Systemic prevention: automated regression tests, lint rules, canary releases'
    ],
    sampleModelAnswer: 'While deploying a database migration, I introduced an unindexed foreign key column on an orders table with millions of rows, causing database CPU spikes and API timeouts. Once alerted by PagerDuty, I immediately notified the incident response channel, took ownership, and executed an automated rollback to restore service within 7 minutes. After service stabilized, I conducted a blameless post-mortem analyzing root causes. To permanently prevent recurrence, I added a migration linter to our CI/CD pipeline that blocks any unindexed foreign key in pull requests, and established staging verification against a sanitised production-scale dataset.'
  },

  // --- SYSTEM DESIGN ---
  {
    id: 'q_sd_1',
    role: 'System Design Engineer',
    type: 'System Design',
    difficulty: 'Hard',
    category: 'Scalability & Caching',
    question: 'Design a distributed URL Shortener (like TinyURL or Bitly) handling 500 million new URLs per month and 100:1 read-to-write ratio. Discuss database choice, ID generation, and caching strategy.',
    expectedConcepts: [
      'Capacity estimation (QPS write: ~200 writes/sec, read: ~20,000 reads/sec)',
      'Base62 encoding (a-z, A-Z, 0-9) yielding 62^7 ~ 3.5 trillion URLs',
      'Unique ID generation: Snowflake ID generator or distributed range allocator (Zookeeper/Redis)',
      'Database: NoSQL Key-Value store (Cassandra / DynamoDB / PostgreSQL with sharding)',
      'Caching: Redis or Memcached with LRU eviction for the 20% hottest URLs (80-20 Pareto rule)',
      'Redirect status code: HTTP 301 (Permanent) vs HTTP 302 (Found) for analytics tracking'
    ],
    sampleModelAnswer: 'For 500M URLs/month, write throughput is ~200 writes/sec, while read throughput is ~20,000 reads/sec. 1) Short URL generation: Using Base62 with 7 characters provides 62^7 ≈ 3.5 trillion unique keys. To generate globally unique keys without collision, we use distributed Twitter Snowflake 64-bit ID generators or pre-allocated range blocks managed via ZooKeeper. 2) Storage: A Key-Value or wide-column store like DynamoDB or Cassandra is ideal because URLs require simple key-lookup without complex joins. 3) Caching: Since 20% of links drive 80% of read traffic, an in-memory Redis cluster with LRU eviction caches hot URLs, reducing DB load by >80%. 4) Redirection: We return HTTP 302 (temporary redirect) instead of 301 so downstream traffic hits our gateway for accurate click analytics and geo-tracking.'
  },

  // --- DATA ANALYST ---
  {
    id: 'q_da_1',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Medium',
    category: 'SQL Window Functions & Business Metrics',
    question: 'How do SQL Window Functions (such as ROW_NUMBER, RANK, DENSE_RANK, and LAG/LEAD) differ from standard GROUP BY aggregations? Give a scenario where LAG is essential.',
    expectedConcepts: [
      'Window functions preserve individual row granularity while computing aggregations over a partition',
      'GROUP BY collapses rows into summary groups',
      'Difference between RANK (skips ranks on ties) and DENSE_RANK (no gaps)',
      'LAG/LEAD accessing previous/subsequent rows without self-joins',
      'Practical scenario: month-over-month revenue growth or churn calculation'
    ],
    sampleModelAnswer: 'Unlike GROUP BY, which collapses multiple rows into a single aggregated summary row, SQL window functions compute metrics over a specified partition of rows while preserving each individual row’s identity and attributes. For example, LAG() allows querying a column value from the preceding row within the partition without executing expensive self-joins. An essential scenario is calculating Month-over-Month (MoM) revenue growth: By partitioning by customer or department, ordering by date, and using LAG(revenue, 1) OVER (ORDER BY month), you can compute ((revenue - prev_revenue) / prev_revenue) * 100 on every row directly.'
  }
];

export function getQuestionsByConfig(
  role: string,
  type: string,
  difficulty: string,
  count: number = 5
): BankQuestion[] {
  // First, filter by role or type
  let matched = QUESTION_BANK.filter(
    (q) =>
      (q.role.toLowerCase().includes(role.toLowerCase()) ||
        role.toLowerCase().includes(q.role.toLowerCase()) ||
        q.type.toLowerCase() === type.toLowerCase())
  );

  // If we have fewer than needed, expand pool
  if (matched.length < count) {
    const additional = QUESTION_BANK.filter((q) => !matched.includes(q));
    matched = [...matched, ...additional];
  }

  // Shuffle and slice to count
  const shuffled = [...matched].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
