# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed

- GitHub Actions deploy workflow now passes `PUBLIC_SANITY_PROJECT_ID` secret as an environment variable during the build step, so Astro can fetch data from Sanity at build time on GitHub Pages.
