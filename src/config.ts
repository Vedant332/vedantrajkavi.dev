import type { SocialsObject } from "./types";

export const SITE = {
  website: "https://swarom.dev",
  author: "Swarom Muley",
  desc: "Software Engineer Living in the San Francisco Bay Area, Particularly Interested in DevOps and Cloud Computing.",
  title: "Swarom Muley",
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
    href: "https://github.com/OneUpWallStreet",
    active: true,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/swarom-muley/",
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:smuley@scu.edu",
    active: true,
  }
];
