import type { Project } from "@/components/ProjectCard";

export const PROJECTS: Project[] = [
  {
    slug: "zprint",
    title: "zPrint",
    description:
      "A next-generation BLE-connected printing solution. Seamlessly connect to thermal printers via Bluetooth Low Energy, enabling wireless printing from any mobile device with zero configuration.",
    status: "coming-soon",
    tags: ["BLE", "Bluetooth", "Flutter", "Mobile", "Printing"],
    icon: "printer",
    featured: true,
  },
  {
    slug: "ble-toolkit",
    title: "BLE Toolkit",
    description:
      "A comprehensive SDK for Bluetooth Low Energy development across all major platforms. Simplifies BLE device scanning, connection management, and data transfer with clean APIs.",
    status: "coming-soon",
    tags: ["BLE", "SDK", "Android", "iOS", "React Native"],
    icon: "radio",
  },
  {
    slug: "firmware-hub",
    title: "Firmware Hub",
    description:
      "Centralized firmware management and OTA update platform. Manage device firmware versions, push updates over-the-air, and monitor deployment status across your fleet.",
    status: "coming-soon",
    tags: ["Firmware", "OTA", "IoT", "Cloud"],
    icon: "zap",
  },
];

export interface TechItem {
  name: string;
  logo: string;
  color?: string;
}

export const TECH_STACK: TechItem[] = [
  {
    name: "Flutter",
    logo: "https://cdn.simpleicons.org/flutter/02569B",
  },
  {
    name: "React Native",
    logo: "https://cdn.simpleicons.org/react/61DAFB",
  },
  {
    name: "Android",
    logo: "https://cdn.simpleicons.org/android/34A853",
  },
  {
    name: "iOS / Swift",
    logo: "https://cdn.simpleicons.org/swift/F05138",
  },
  {
    name: "Kotlin",
    logo: "https://cdn.simpleicons.org/kotlin/7F52FF",
  },
  {
    name: "Bluetooth",
    logo: "https://cdn.simpleicons.org/bluetooth/0082FC",
  },
  {
    name: "TypeScript",
    logo: "https://cdn.simpleicons.org/typescript/3178C6",
  },
  {
    name: "Next.js",
    logo: "https://cdn.simpleicons.org/nextdotjs/ffffff",
  },
  {
    name: "Node.js",
    logo: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
  },
  {
    name: "Python",
    logo: "https://cdn.simpleicons.org/python/3776AB",
  },
  {
    name: "Docker",
    logo: "https://cdn.simpleicons.org/docker/2496ED",
  },
  {
    name: "AWS",
    logo: "https://cdn.simpleicons.org/amazonwebservices/FF9900",
  },
  {
    name: "Go",
    logo: "https://cdn.simpleicons.org/go/00ADD8",
  },
  {
    name: "Rust",
    logo: "https://cdn.simpleicons.org/rust/DEA584",
  },
];

export const FEATURES = [
  {
    icon: "bluetooth",
    title: "BLE Connectivity",
    description:
      "Deep expertise in Bluetooth Low Energy protocol. We build reliable, power-efficient wireless solutions for IoT devices across all platforms.",
  },
  {
    icon: "mobile",
    title: "Cross-Platform Mobile",
    description:
      "Flutter, React Native, native Android (Kotlin) & iOS (Swift). We deliver polished mobile experiences with seamless device integration.",
  },
  {
    icon: "cpu",
    title: "Embedded & IoT Cloud",
    description:
      "End-to-end solutions from bare-metal firmware to complete IoT architectures, including device management, data pipelines, and OTA updates.",
  },
  {
    icon: "sparkles",
    title: "AI Agents & Automation",
    description:
      "Designing intelligent AI agents with built-in evaluation and feedback mechanisms to ensure high-quality, secure outputs while powering massive productivity.",
  },
];

export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  github: string;
  nickname?: string;
  image?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "An Sy Tung",
    nickname: "Noah",
    role: "AI Workflow and Automation Expert | Full Stack Expert",
    linkedin: "https://www.linkedin.com/in/sytungan/",
    github: "https://github.com/sytungan",
    image: "https://github.com/sytungan.png",
  },
  {
    name: "Tri Dang Huynh Minh",
    nickname: "Tri",
    role: "Mobile Development Expert | KMP & Flutter Expert | Architecting Secure SDKs & BLE Solutions",
    linkedin: "https://www.linkedin.com/in/tridhm/",
    github: "https://github.com/minhtri1401",
    image: "https://github.com/minhtri1401.png",
  },
  {
    name: "Khanh Nguyen Dinh",
    nickname: "Koro",
    role: "Mobile Architect Expert | RFID & POS Payment Solutions",
    linkedin: "https://www.linkedin.com/in/dinhkhanh412/",
    github: "https://github.com/dinhkhanh412",
    image: "https://github.com/dinhkhanh412.png",
  },
];
