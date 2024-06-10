import type { SocialsObject } from "./types";

export const SITE = {
  website: "https://vedantkv.dev",
  author: "Vedant Raj Kavi",
  desc: "Software Engineer Living in the San Francisco Bay Area, Particularly Interested in DevOps and Cloud Computing.",
  title: "Vedant Raj Kavi",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialsObject = [
  {
    name: "Github",
    href: "https://github.com/Vedant332",
    active: true,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/vedantrajkavi/",
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:vkavi@scu.edu",
    active: true,
  }
];
