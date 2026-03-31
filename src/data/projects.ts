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
    title: "Embedded Systems",
    description:
      "Firmware development and embedded software for microcontrollers and SoCs. From bare-metal to RTOS.",
  },
  {
    icon: "cloud",
    title: "Cloud & IoT",
    description:
      "End-to-end IoT architectures — device management, data pipelines, real-time monitoring, and OTA updates.",
  },
];
