-- ==========================================================
-- ResearchLens Demo Seed Data
-- ==========================================================

-- Insert Demo User (Password: "Password123!")
-- Note: Replace password_hash with bcrypt hash of 'Password123!'
INSERT INTO users (id, email, password_hash, full_name, organization, role)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'dr.alex@researchlens.ai',
    '$2a$10$bqmRkf1XN45xDeN4ppeO8OV6SL3wnbUGqEu77BhUqQTXacAOX0.kC',
    'Dr. Alex Rivera',
    'Center for Neural Computing & AI Labs',
    'Lead Scientist'
) ON CONFLICT (email) DO NOTHING;

-- Insert Sample Research Project
INSERT INTO research_projects (id, user_id, title, query, domain, status, plan, summary, key_findings)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Sub-Quadratic Attention Mechanisms for Long-Context LLMs',
    'Investigating linear and sparse attention approximations in modern Transformer architectures to handle 1M+ token contexts without quadratic memory degradation.',
    'Deep Learning & NLP',
    'completed',
    '{
        "hypothesis": "Hybrid state space models and structured sparse attention achieve comparable perplexity to full self-attention with O(N) inference latency.",
        "searchQueries": [
            "Linear attention State Space Models Mamba Transformers",
            "FlashAttention-2 IO awareness memory hierarchy",
            "LongLoRA token downsampling long context fine-tuning"
        ],
        "targetMetrics": ["Inference FLOPs", "Perplexity on PG19", "Memory footprint vs context length"]
    }'::jsonb,
    'A comprehensive survey of 4 leading methodologies tackling the quadratic O(N^2) memory bottleneck in Transformer self-attention. The analysis contrasts exact hardware-aware methods like FlashAttention-2 with sub-quadratic architectures such as Mamba (SSMs) and RingAttention.',
    '["FlashAttention-2 provides 2-3x speedup while preserving exact mathematical attention equivalence.", "Mamba eliminates quadratic scaling for inference, but exhibits modest recall degradation in high-needle associative retrieval tasks.", "Hardware-aware SRAM tiling outperforms naive algorithmic token-pruning in real-world GPU throughput."]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert Papers
INSERT INTO papers (id, project_id, title, authors, abstract, year, journal_or_venue, doi, url, citation_count, source, score)
VALUES
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
    '["Tri Dao"]'::jsonb,
    'FlashAttention revolutionized long context training by making attention IO-aware. In this paper, we propose FlashAttention-2, optimizing work partitioning across GPU thread blocks to reach up to 73% theoretical peak FLOPs on A100s.',
    2023,
    'arXiv preprint arXiv:2307.08691',
    '10.48550/arXiv.2307.08691',
    'https://arxiv.org/abs/2307.08691',
    1420,
    'arXiv',
    9.85
),
(
    'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    '["Albert Gu", "Tri Dao"]'::jsonb,
    'Foundation models face high computational cost for long sequences due to quadratic attention. We introduce Mamba, a selective structured state space model running with linear complexity O(N), matching Transformers across 80+ benchmarks.',
    2023,
    'arXiv preprint arXiv:2312.00752',
    '10.48550/arXiv.2312.00752',
    'https://arxiv.org/abs/2312.00752',
    1150,
    'arXiv',
    9.60
),
(
    'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'RingAttention with Blockwise Transformers for Near-Infinite Context',
    '["Hao Liu", "Matei Zaharia", "Pieter Abbeel"]'::jsonb,
    'Transformers are bounded by memory capacity per device. RingAttention distributes sequence blocks across hosts in a ring topology, overlapping communication with computation to scale context size up to millions of tokens.',
    2023,
    'ICLR 2024',
    '10.48550/arXiv.2310.01889',
    'https://arxiv.org/abs/2310.01889',
    480,
    'arXiv',
    9.15
) ON CONFLICT (id) DO NOTHING;

-- Insert Paper Analyses
INSERT INTO paper_analyses (id, paper_id, project_id, methodology, datasets_used, sample_size, main_contributions, strengths, limitations, relevance_score, summary)
VALUES
(
    'f6a7b89c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Hardware-aware parallel algorithm dividing Q, K, V matrices into SRAM tiles, avoiding HBM read/write bottlenecks.',
    '["GPT-3 2.7B benchmarks", "Llama-2 fine-tuning suites"]'::jsonb,
    'Sequences 512 to 32,768 tokens',
    '["Reorganized work partitioning across warps", "Reduced non-matmul FLOPs", "Attained 225 TFLOPs/s on A100"]'::jsonb,
    '["Exact attention output (lossless)", "Direct drop-in replacement for standard Multi-Head Attention", "Exceptional hardware saturation"]'::jsonb,
    '["Still scales quadratically in theoretical FLOPs as sequence approaches infinity", "Hardware-tailored for CUDA architecture"]'::jsonb,
    10,
    'Groundbreaking CUDA engineering masterpiece that addresses the memory-bandwidth wall rather than approximating the math.'
),
(
    'a7b89c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Parameterizes state transitions dynamically conditional on input tokens, combined with hardware scan kernels.',
    '["Pile", "Wikitext-103", "LAMBADA", "PG-19"]'::jsonb,
    'Datasets with >300B pre-training tokens',
    '["Input-dependent selection mechanism for continuous state spaces", "Linear time and memory scaling", "Fast recurrent inference state"]'::jsonb,
    '["Constant memory consumption per generation step", "True sub-quadratic scaling"]'::jsonb,
    '["Weaker multi-needle retrieval across ultra-long contexts compared to dense attention", "Difficult to parallelize cross-attention"]'::jsonb,
    9,
    'Pioneering non-Transformer foundational model proving state-space recurrence can rival dense attention at scale.'
) ON CONFLICT (id) DO NOTHING;

-- Insert Cross-Paper Comparison
INSERT INTO paper_comparisons (id, project_id, matrix_data, comparison_summary, key_tradeoffs)
VALUES (
    'b89c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    '[
        {"paper": "FlashAttention-2", "complexity": "O(N^2) FLOPs, O(N) IO", "exactMath": true, "hardwareSpecialization": "NVIDIA CUDA/TensorCore", "contextLimit": "~64k tokens per single node", "generationLatency": "Linear in history (KV cache required)"},
        {"paper": "Mamba (SSM)", "complexity": "O(N) FLOPs, O(1) State", "exactMath": false, "hardwareSpecialization": "Fused selective scan GPU kernel", "contextLimit": "1M+ tokens", "generationLatency": "Constant O(1) state update"},
        {"paper": "RingAttention", "complexity": "O(N^2) distributed", "exactMath": true, "hardwareSpecialization": "InfiniBand / Ring Interconnect", "contextLimit": "Millions (across cluster)", "generationLatency": "Communication overhead bounded"}
    ]'::jsonb,
    'The evaluation demonstrates a clear tradeoff between strict mathematical preservation (FlashAttention-2, RingAttention) and throughput efficiency for ultra-long context inference (Mamba).',
    '["Hardware-level memory hierarchy optimization vs algorithmic recurrence", "KV Cache scaling memory explosion vs Fixed hidden state retention", "Single-device saturation vs Multi-node ring communication overhead"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert Research Gaps
INSERT INTO research_gaps (id, project_id, title, category, description, impact_level, supporting_evidence)
VALUES
(
    'c9d0e1f2-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Multi-hop Associative Recall in Pure State-Space Models',
    'Theoretical & Empirical',
    'While Mamba excels at synthetic induction heads, deep multi-hop reasoning over contexts >256k tokens degrades when compared to exact attention mechanisms.',
    'High',
    '["BABILong Benchmark reveals 14% drop in Mamba-3B accuracy past 128k context compared to FlashAttention tuned Llama-2."]'::jsonb
),
(
    'd0e1f2a3-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Interconnect Bandwidth Saturation in RingAttention for Edge Devices',
    'Hardware & Systems',
    'RingAttention assumes high-bandwidth interconnects (NVLink/InfiniBand). Over standard PCIe or distributed edge consumer GPUs, network transfer bubbles eclipse compute overlap.',
    'Medium',
    '["Under standard 10GbE network conditions, RingAttention spend ratio exceeds 65% idle communication waiting."]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert Future Directions
INSERT INTO future_directions (id, project_id, proposal_title, hypothesis, suggested_methodology, expected_challenges, potential_impact, feasibility_score)
VALUES
(
    'e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Hybrid Flash-Mamba: Interleaved Sparse Attention with Dense Selective Recurrence',
    'Interleaving 1 exact FlashAttention layer for every 4 selective Mamba SSM layers will maintain constant memory inference advantages while recovering 99% of associative multi-hop retrieval accuracy.',
    'Train a 7B parameter hybrid backbone on 500B tokens using staged distillation from an existing dense Transformer, benchmark on Ruler and BABILong suites.',
    '["Balancing gradient stability across heterogeneous layer dynamics", "Optimizing unified memory allocations for mixed KV caches and recurrent states"]'::jsonb,
    'Could redefine foundation model backbones by eliminating massive KV cache bottlenecks while preserving needle-in-a-haystack accuracy.',
    8
) ON CONFLICT (id) DO NOTHING;

-- Insert Final Report
INSERT INTO reports (id, project_id, title, executive_summary, markdown_content, table_of_contents)
VALUES (
    'f2a3b4c5-6d7e-8f9a-0b1c-2d3e4f5a6b7c',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'Comprehensive Synthesis Report: Advancements in Sub-Quadratic Attention and Long-Context Architectures',
    'This report synthesizes contemporary state-of-the-art architectures designed to alleviate the quadratic compute and memory bottleneck in large language models. The findings demonstrate that hardware-aware exact attention (FlashAttention-2) remains optimal for context lengths up to 64k tokens, while selective state spaces (Mamba) and distributed ring topologies (RingAttention) offer compelling alternatives for context horizons scaling into millions of tokens.',
    '# Comprehensive Synthesis Report: Advancements in Sub-Quadratic Attention

## Executive Summary
Large Language Models (LLMs) continue to demand greater context windows to ingest legal contracts, code repositories, and longitudinal medical histories. However, the standard Transformer self-attention mechanism requires $O(N^2)$ memory and compute, presenting a severe computational bottleneck.

This analysis evaluates three primary paradigms:
1. **Hardware-aware Exact Attention**: FlashAttention-2
2. **Selective State Space Models (SSMs)**: Mamba
3. **Distributed Blockwise Topologies**: RingAttention

---

## 1. Algorithmic and Hardware Comparisons
| Dimension | FlashAttention-2 | Mamba (SSM) | RingAttention |
| :--- | :--- | :--- | :--- |
| **Complexity** | $O(N^2)$ FLOPs, $O(N)$ IO | $O(N)$ Compute, $O(1)$ State | Distributed $O(N^2)$ |
| **Mathematical Equivalence** | Exact | Recurrent Approximation | Exact |
| **KV Cache Requirement** | Yes ($O(N)$ memory) | No (Fixed state) | Yes (Distributed across nodes) |
| **Target Scale** | Up to 64k single GPU | 1M+ tokens | Near Infinite (Cluster bound) |

---

## 2. Research Gaps Identified
- **State-Space Multi-hop Recall**: Pure SSMs show selective amnesia on complex multi-variable pointer chains beyond 256k tokens.
- **Interconnect Sensitivities**: RingAttention relies on latency-hiding communications that require NVLink; performance degrades sharply on commodity Ethernet networks.

---

## 3. Recommended Future Roadmap
We recommend exploring **Hybrid Recurrent-Attention (HRA)** designs where sparse attention heads anchor semantic reference points while selective recurrence processes dense sequence flow.',
    '[{"title": "Executive Summary", "level": 1}, {"title": "Algorithmic and Hardware Comparisons", "level": 1}, {"title": "Research Gaps Identified", "level": 1}, {"title": "Recommended Future Roadmap", "level": 1}]'::jsonb
) ON CONFLICT (id) DO NOTHING;
