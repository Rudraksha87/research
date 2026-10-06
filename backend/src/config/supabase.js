const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

let supabase = null;
let isConfigured = false;

if (env.SUPABASE_URL && env.SUPABASE_KEY && !env.SUPABASE_URL.includes('your-project')) {
  try {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    isConfigured = true;
    console.log('✅ Supabase client successfully initialized.');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.info('ℹ️ Supabase credentials not set or placeholder detected. Operating with in-memory persistence layer.');
}

// In-Memory store fallback for offline development & rapid testing
const memoryStore = {
  users: [
    {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      email: 'dr.alex@researchlens.ai',
      // bcrypt hash for "Password123!"
      password_hash: '$2a$10$bqmRkf1XN45xDeN4ppeO8OV6SL3wnbUGqEu77BhUqQTXacAOX0.kC',
      full_name: 'Dr. Alex Rivera',
      organization: 'Center for Neural Computing & AI Labs',
      role: 'Lead Scientist',
      created_at: new Date().toISOString()
    }
  ],
  research_projects: [
    {
      id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      user_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Sub-Quadratic Attention Mechanisms for Long-Context LLMs',
      query: 'Investigating linear and sparse attention approximations in modern Transformer architectures to handle 1M+ token contexts without quadratic memory degradation.',
      domain: 'Deep Learning & NLP',
      status: 'completed',
      plan: {
        hypothesis: 'Hybrid state space models and structured sparse attention achieve comparable perplexity to full self-attention with O(N) inference latency.',
        searchQueries: [
          'Linear attention State Space Models Mamba Transformers',
          'FlashAttention-2 IO awareness memory hierarchy',
          'LongLoRA token downsampling long context fine-tuning'
        ],
        targetMetrics: ['Inference FLOPs', 'Perplexity on PG19', 'Memory footprint vs context length']
      },
      summary: 'A comprehensive survey of leading methodologies tackling the quadratic O(N^2) memory bottleneck in Transformer self-attention. The analysis contrasts exact hardware-aware methods like FlashAttention-2 with sub-quadratic architectures such as Mamba (SSMs) and RingAttention.',
      key_findings: [
        'FlashAttention-2 provides 2-3x speedup while preserving exact mathematical attention equivalence.',
        'Mamba eliminates quadratic scaling for inference, but exhibits modest recall degradation in high-needle associative retrieval tasks.',
        'Hardware-aware SRAM tiling outperforms naive algorithmic token-pruning in real-world GPU throughput.'
      ],
      created_at: new Date().toISOString()
    }
  ],
  papers: [
    {
      id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
      authors: ['Tri Dao'],
      abstract: 'FlashAttention revolutionized long context training by making attention IO-aware. FlashAttention-2 optimizes work partitioning across GPU thread blocks to reach up to 73% theoretical peak FLOPs.',
      year: 2023,
      journal_or_venue: 'arXiv preprint arXiv:2307.08691',
      doi: '10.48550/arXiv.2307.08691',
      url: 'https://arxiv.org/abs/2307.08691',
      citation_count: 1420,
      source: 'arXiv',
      score: 9.85,
      created_at: new Date().toISOString()
    },
    {
      id: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
      authors: ['Albert Gu', 'Tri Dao'],
      abstract: 'Foundation models face high computational cost for long sequences due to quadratic attention. We introduce Mamba, a selective structured state space model running with linear complexity O(N).',
      year: 2023,
      journal_or_venue: 'arXiv preprint arXiv:2312.00752',
      doi: '10.48550/arXiv.2312.00752',
      url: 'https://arxiv.org/abs/2312.00752',
      citation_count: 1150,
      source: 'arXiv',
      score: 9.60,
      created_at: new Date().toISOString()
    },
    {
      id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'RingAttention with Blockwise Transformers for Near-Infinite Context',
      authors: ['Hao Liu', 'Matei Zaharia', 'Pieter Abbeel'],
      abstract: 'RingAttention distributes sequence blocks across hosts in a ring topology, overlapping communication with computation to scale context size up to millions of tokens.',
      year: 2023,
      journal_or_venue: 'ICLR 2024',
      doi: '10.48550/arXiv.2310.01889',
      url: 'https://arxiv.org/abs/2310.01889',
      citation_count: 480,
      source: 'arXiv',
      score: 9.15,
      created_at: new Date().toISOString()
    }
  ],
  paper_analyses: [
    {
      id: 'f6a7b89c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
      paper_id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      methodology: 'Hardware-aware parallel algorithm dividing Q, K, V matrices into SRAM tiles, avoiding HBM read/write bottlenecks.',
      datasets_used: ['GPT-3 2.7B benchmarks', 'Llama-2 fine-tuning suites'],
      sample_size: 'Sequences 512 to 32,768 tokens',
      main_contributions: ['Reorganized work partitioning across warps', 'Reduced non-matmul FLOPs', 'Attained 225 TFLOPs/s on A100'],
      strengths: ['Exact attention output (lossless)', 'Direct drop-in replacement for standard Multi-Head Attention'],
      limitations: ['Still scales quadratically in theoretical FLOPs as sequence approaches infinity', 'Tailored for NVIDIA CUDA architecture'],
      relevance_score: 10,
      summary: 'Groundbreaking CUDA engineering masterpiece addressing memory-bandwidth bottlenecks.'
    },
    {
      id: 'a7b89c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
      paper_id: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      methodology: 'Parameterizes state transitions dynamically conditional on input tokens, combined with hardware scan kernels.',
      datasets_used: ['Pile', 'Wikitext-103', 'LAMBADA', 'PG-19'],
      sample_size: 'Datasets with >300B pre-training tokens',
      main_contributions: ['Input-dependent selection mechanism for continuous state spaces', 'Linear time and memory scaling'],
      strengths: ['Constant memory consumption per generation step', 'True sub-quadratic scaling'],
      limitations: ['Weaker multi-needle retrieval across ultra-long contexts compared to dense attention'],
      relevance_score: 9,
      summary: 'Pioneering non-Transformer foundational model proving state-space recurrence can rival dense attention at scale.'
    }
  ],
  paper_comparisons: [
    {
      id: 'b89c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      matrix_data: [
        { paper: 'FlashAttention-2', complexity: 'O(N^2) FLOPs, O(N) IO', exactMath: 'Yes (Exact)', hardwareSpecialization: 'NVIDIA CUDA / TensorCore', contextLimit: '~64k tokens per node', generationLatency: 'Linear in history (KV cache)' },
        { paper: 'Mamba (SSM)', complexity: 'O(N) FLOPs, O(1) State', exactMath: 'No (Recurrent approx)', hardwareSpecialization: 'Fused selective scan GPU kernel', contextLimit: '1M+ tokens', generationLatency: 'Constant O(1) step' },
        { paper: 'RingAttention', complexity: 'Distributed O(N^2)', exactMath: 'Yes (Exact)', hardwareSpecialization: 'InfiniBand / Ring Interconnect', contextLimit: 'Millions (distributed)', generationLatency: 'Bounded by ring communication' }
      ],
      comparison_summary: 'Evaluation highlights the fundamental tension between mathematical purity (FlashAttention-2, RingAttention) and state efficiency for ultra-long context throughput (Mamba).',
      key_tradeoffs: [
        'Hardware SRAM tiling optimization vs Algorithmic continuous state dynamics',
        'KV Cache memory explosion vs Fixed hidden state retention',
        'Single-GPU hardware saturation vs Multi-node ring communication latency'
      ]
    }
  ],
  research_gaps: [
    {
      id: 'c9d0e1f2-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'Multi-hop Associative Recall in Pure State-Space Models',
      category: 'Theoretical & Empirical',
      description: 'While Mamba excels at synthetic induction heads, deep multi-hop reasoning over contexts >256k tokens degrades when compared to exact attention mechanisms.',
      impact_level: 'High',
      supporting_evidence: ['BABILong Benchmark reveals 14% drop in Mamba-3B accuracy past 128k context compared to FlashAttention tuned Llama-2.']
    },
    {
      id: 'd0e1f2a3-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'Interconnect Bandwidth Saturation in RingAttention for Commodity Edge Devices',
      category: 'Hardware & Systems',
      description: 'RingAttention assumes ultra-high bandwidth interconnects. Over standard PCIe or distributed edge consumer GPUs, network transfer bubbles eclipse compute overlap.',
      impact_level: 'Medium',
      supporting_evidence: ['Under standard 10GbE network conditions, RingAttention spend ratio exceeds 65% idle communication waiting.']
    }
  ],
  future_directions: [
    {
      id: 'e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      proposal_title: 'Hybrid Flash-Mamba: Interleaved Sparse Attention with Dense Selective Recurrence',
      hypothesis: 'Interleaving 1 exact FlashAttention layer for every 4 selective Mamba SSM layers will maintain constant memory inference advantages while recovering 99% of associative multi-hop retrieval accuracy.',
      suggested_methodology: 'Train a 7B parameter hybrid backbone on 500B tokens using staged distillation from an existing dense Transformer, benchmark on Ruler and BABILong suites.',
      expected_challenges: ['Balancing gradient stability across heterogeneous layer dynamics', 'Optimizing unified memory allocations for mixed KV caches and recurrent states'],
      potential_impact: 'Could redefine foundation model backbones by eliminating massive KV cache bottlenecks while preserving needle-in-a-haystack accuracy.',
      feasibility_score: 8
    }
  ],
  reports: [
    {
      id: 'f2a3b4c5-6d7e-8f9a-0b1c-2d3e4f5a6b7c',
      project_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      title: 'Comprehensive Synthesis Report: Advancements in Sub-Quadratic Attention and Long-Context Architectures',
      executive_summary: 'This report synthesizes contemporary state-of-the-art architectures designed to alleviate the quadratic compute and memory bottleneck in large language models. The findings demonstrate that hardware-aware exact attention (FlashAttention-2) remains optimal for context lengths up to 64k tokens, while selective state spaces (Mamba) and distributed ring topologies (RingAttention) offer compelling alternatives for context horizons scaling into millions of tokens.',
      markdown_content: `# Comprehensive Synthesis Report: Advancements in Sub-Quadratic Attention

## Executive Summary
Large Language Models (LLMs) continue to demand greater context windows to ingest legal contracts, code repositories, and longitudinal medical histories. However, the standard Transformer self-attention mechanism requires O(N^2) memory and compute, presenting a severe computational bottleneck.

This analysis evaluates three primary paradigms:
1. **Hardware-aware Exact Attention**: FlashAttention-2
2. **Selective State Space Models (SSMs)**: Mamba
3. **Distributed Blockwise Topologies**: RingAttention

---

## 1. Algorithmic and Hardware Comparisons
- **FlashAttention-2**: Exact quadratic compute, but linear IO transfer using SRAM tiling. Best for single-node dense models.
- **Mamba**: Sub-quadratic linear scaling O(N), eliminates KV cache memory during autoregressive generation.
- **RingAttention**: Retains exact attention while distributing blocks in a ring over multiple GPUs.

---

## 2. Research Gaps Identified
- **State-Space Multi-hop Recall**: Pure SSMs show selective amnesia on complex multi-variable pointer chains beyond 256k tokens.
- **Interconnect Sensitivities**: RingAttention relies on latency-hiding communications that require NVLink; performance degrades sharply on commodity Ethernet networks.

---

## 3. Recommended Future Roadmap
We recommend exploring **Hybrid Recurrent-Attention (HRA)** designs where sparse attention heads anchor semantic reference points while selective recurrence processes dense sequence flow.`,
      table_of_contents: [
        { title: 'Executive Summary', level: 1 },
        { title: 'Algorithmic and Hardware Comparisons', level: 1 },
        { title: 'Research Gaps Identified', level: 1 },
        { title: 'Recommended Future Roadmap', level: 1 }
      ]
    }
  ],
  document_uploads: []
};

module.exports = {
  supabase,
  isConfigured,
  memoryStore
};
