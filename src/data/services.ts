import { ServiceItem } from "@/types/service";

export const servicesData: ServiceItem[] = [
  {
    id: "fountain-maintenance",
    slug: "fountain-maintenance",
    title: "Fountain Maintenance",
    shortDescription:
      "Routine cleaning, algae control, water clarity management, and system inspection for tier, wall, and architectural fountains.",
    fullDescription:
      "Keep your architectural or garden fountain running crystal-clear year-round. Our routine maintenance program prevents mineral scale accumulation, controls algae growth, balances water chemistry safely, cleans intake screens, and monitors pump performance to protect your fountain investment.",
    iconName: "Droplets",
    benefits: [
      "Extends pump and plumbing lifespan",
      "Prevents unsightly algae blooms and white mineral scale",
      "Saves money on costly premature component replacements",
      "Maintains safe, hygienic water conditions"
    ],
    features: [
      "Debris removal and basin skimming",
      "Water chemistry balancing and algae prevention",
      "Pump filter and impeller cleaning",
      "Auto-fill valve and level sensor checking",
      "Surface scrubbing and scaling treatment"
    ],
    processSteps: [
      {
        title: "Initial Inspection",
        description: "We evaluate water clarity, flow rates, pump acoustics, and basin condition."
      },
      {
        title: "System Skimming & Scrubbing",
        description: "Debris is cleared, and basin walls are brushed to loosen bio-film and algae."
      },
      {
        title: "Filter & Pump Servicing",
        description: "Intake screens are cleaned to ensure unhindered water circulation."
      },
      {
        title: "Water Chemistry Balancing",
        description: "Eco-friendly treatments are added to control algae and prevent hard water scale."
      }
    ],
    commonIssues: [
      "Green water and foam build-up",
      "White calcium crusting on stone tiers",
      "Clogged pump intake causing weak water streams",
      "Unpleasant stagnant water odors"
    ]
  },
  {
    id: "fountain-repair",
    slug: "fountain-repair",
    title: "Fountain Repair",
    shortDescription:
      "Expert troubleshooting and repairs for non-functioning pumps, leaks, cracked basins, faulty auto-fills, and electrical supply lines.",
    fullDescription:
      "When your fountain stops flowing, leaks water, or makes grinding noises, our experienced technicians diagnose the underlying mechanical or structural issue promptly. Drawing on industry experience dating back to 1992 and serving Orange and Los Angeles Counties, we restore reliable operation to fountains of all sizes.",
    iconName: "Wrench",
    benefits: [
      "Accurate root-cause diagnostics saving unnecessary replacement costs",
      "High-grade replacement parts for long-term dependability",
      "Restoration of optimal water flow and sound aesthetics",
      "Prevention of structural water damage to surrounding hardscapes"
    ],
    features: [
      "Submersible and external pump troubleshooting",
      "Basin crack sealing and waterproofing",
      "Auto-fill valve repair and replacement",
      "Nozzle and manifold flow balancing",
      "Low-voltage underwater lighting repairs"
    ],
    processSteps: [
      {
        title: "Diagnostic Assessment",
        description: "We test electrical lines, water pressure, seals, and plumbing fixtures."
      },
      {
        title: "Detailed Estimate",
        description: "You receive a clear breakdown of needed repairs and component options."
      },
      {
        title: "Precision Repair",
        description: "Defective components are replaced or repaired using industry-grade materials."
      },
      {
        title: "Flow Balancing & Testing",
        description: "We verify leak-free operation, correct water height, and optimal sound."
      }
    ],
    commonIssues: [
      "Fountain completely stopped flowing",
      "Fountain losing water rapidly",
      "Noisy or vibrating pump motor",
      "Tripping circuit breakers or GFCI outlets"
    ]
  },
  {
    id: "pond-cleaning",
    slug: "pond-cleaning",
    title: "Pond Cleaning & Maintenance",
    shortDescription:
      "Comprehensive cleanouts, sludge removal, biological filter upkeep, and water clarity management for residential and koi ponds.",
    fullDescription:
      "Maintaining a healthy pond requires balancing mechanical filtration, biological filtration, and aquatic safety. We provide full seasonal cleanouts and ongoing pond maintenance to remove bottom sludge, maintain oxygen levels, clean skimmer boxes, and protect your ecosystem.",
    iconName: "Waves",
    benefits: [
      "Crystal-clear water that highlights fish and aquatic features",
      "Removal of harmful organic sludge and toxic ammonia build-up",
      "Improved oxygen circulation and biological filtration efficiency",
      "Healthy environment for koi, goldfish, and aquatic plants"
    ],
    features: [
      "Complete or partial water change-out services",
      "Bottom muck and organic waste vacuuming",
      "Biological filter pad rinsing and media replacement",
      "UV clarifier bulb replacement and quartz sleeve cleaning",
      "Aquatic plant trimming and seasonal pond prep"
    ],
    processSteps: [
      {
        title: "Fish & Plant Safeguarding",
        description: "Fish are carefully held in aerated tanks during major cleanings."
      },
      {
        title: "Drainage & Sludge Vacuuming",
        description: "Water is safely drained while bottom muck and organic matter are extracted."
      },
      {
        title: "Pressure Washing Rocks & Filters",
        description: "Perimeter rocks and bio-filters are thoroughly rinsed."
      },
      {
        title: "Refill & Water Conditioning",
        description: "Pond is refilled with detoxified water and beneficial bacteria supplements."
      }
    ],
    commonIssues: [
      "Muck accumulation creating foul hydrogen sulfide smells",
      "Heavy string algae blanketing rocks and bio-filters",
      "Cloudy brown or pea-green water",
      "Clogged skimmers and UV sterilizer failures"
    ]
  },
  {
    id: "pump-repair",
    slug: "pump-repair",
    title: "Pump Repair & Replacement",
    shortDescription:
      "Fast replacement and repair services for submersible pumps, external centrifugal pumps, and energy-efficient water circulation systems.",
    fullDescription:
      "The pump is the heart of every fountain, pond, and waterfall. A malfunctioning pump starves your feature of circulation, leading to stagnant water and algae growth. We repair and install commercial and residential pumps sized precisely for correct head pressure and energy efficiency.",
    iconName: "Zap",
    benefits: [
      "Properly sized pumps reduce monthly electrical consumption",
      "Quiet, whisper-smooth circulation performance",
      "Commercial-grade longevity engineered for continuous operation",
      "Reduced strain on plumbing lines and check valves"
    ],
    features: [
      "Submersible pump replacement",
      "External self-priming pump installations",
      "Impeller clearance and debris removal",
      "Check valve and union disconnect installations",
      "Variable speed pump upgrades for energy savings"
    ],
    processSteps: [
      {
        title: "Flow & Electrical Diagnostics",
        description: "We measure voltage, amp draw, and flow rate to determine pump health."
      },
      {
        title: "Sizing & Model Selection",
        description: "We select an exact match or energy-efficient replacement for your head pressure."
      },
      {
        title: "Installation & Plumbing Union Setup",
        description: "We install quick-disconnect unions and heavy-duty check valves for easy future service."
      },
      {
        title: "Operational Testing",
        description: "We verify priming, pressure, and noise-free operation."
      }
    ],
    commonIssues: [
      "Pump humming but not pushing water",
      "Pump overheating and shutting down periodically",
      "Excessive rattle, vibration, or grinding noise",
      "Pump tripping electrical panel repeatedly"
    ]
  },
  {
    id: "leak-detection",
    slug: "leak-detection",
    title: "Leak Detection & Sealing",
    shortDescription:
      "Advanced leak location for hidden plumbing leaks, cracked waterfall liners, basin fissures, and auto-fill water loss issues.",
    fullDescription:
      "Losing water in your fountain or pond increases utility bills and risks structural foundation damage. Our leak detection experts isolate whether water loss stems from evaporation, plumbing pressure loss, cracked liner membranes, or stone basin fissures, providing durable sealing solutions.",
    iconName: "Search",
    benefits: [
      "Prevents costly water bill spikes and water waste",
      "Protects surrounding concrete, soil, and house foundations",
      "Pinpoints exact leak locations to minimize invasive structural work",
      "Durable waterproofing materials built to withstand outdoor elements"
    ],
    features: [
      "Static water level drop testing",
      "Underground plumbing pressure testing",
      "Waterfall stream isolate-and-test procedures",
      "EPDM pond liner patch and seal repair",
      "Flexible rubberized epoxy and stone seam sealing"
    ],
    processSteps: [
      {
        title: "Isolate & Measure",
        description: "We isolate individual basins and piping to record water loss rates."
      },
      {
        title: "Pressure & Structural Test",
        description: "Plumbing lines are pressure-tested while rock seams are inspected with dye."
      },
      {
        title: "Targeted Sealing Repair",
        description: "Liners are patched, plumbing is repaired, or masonry is sealed."
      },
      {
        title: "24-Hour Hold Verification",
        description: "We verify that water levels remain stable under full operational load."
      }
    ],
    commonIssues: [
      "Auto-fill valve running continuously",
      "Water level dropping multiple inches per day",
      "Soggy soil or damp hardscape around water feature",
      "Visible cracks along stone tiers or concrete basin"
    ]
  },
  {
    id: "commercial-water-features",
    slug: "commercial-water-features",
    title: "Commercial Water Feature Maintenance",
    shortDescription:
      "Scheduled maintenance, water quality management, and emergency response for commercial plazas, HOAs, hotels, and office parks.",
    fullDescription:
      "Commercial water features serve as primary focal points for shopping centers, office complexes, luxury HOAs, and hospitality venues. We deliver reliable scheduled maintenance programs tailored to high-traffic commercial environments with strict water clarity and safety standards.",
    iconName: "Building2",
    benefits: [
      "Pristine appearance that enhances tenant and guest satisfaction",
      "Proactive maintenance logs and property manager reports",
      "Reduced liability through clean, non-slip, properly treated water",
      "Flexible weekly, bi-weekly, or monthly service plans"
    ],
    features: [
      "High-capacity commercial pump & filtration maintenance",
      "Automated chemical dosing system monitoring",
      "Large-scale fountain and reflect pool basin cleaning",
      "Emergency service call priority for commercial clients",
      "Detailed service log reporting for property management records"
    ],
    processSteps: [
      {
        title: "Property Manager Consultation",
        description: "We assess facility needs, access schedules, and service expectations."
      },
      {
        title: "Customized Service Schedule",
        description: "We establish regular service visits timed to minimize disruption to tenants or guests."
      },
      {
        title: "Comprehensive Weekly Service",
        description: "Full cleaning, chemical dosing, filter backwashing, and mechanical check."
      },
      {
        title: "Direct Digital Reporting",
        description: "Service updates and proactive equipment recommendations are sent to management."
      }
    ],
    commonIssues: [
      "Frequent algae blooms in large architectural basins",
      "Chemical imbalance causing foam or discolored water",
      "High mechanical wear due to 24/7 continuous commercial operation",
      "Vandalism or debris accumulation from public foot traffic"
    ]
  }
];
