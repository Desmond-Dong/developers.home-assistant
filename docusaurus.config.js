module.exports = {
  title: "Home Assistant 开发者文档",
  tagline: "开始开发所需的一切",
  url: "https://www.hasscn.top",
  baseUrl: "/developers/",
  favicon: "img/favicon.png",
  organizationName: "home-assistant",
  projectName: "developers.home-assistant",
  themeConfig: {
    navbar: {
      title: "开发者",
      logo: {
        alt: "Home Assistant",
        src: "img/logo.svg",
        srcDark: "img/logo.svg",
      },
      items: [
        {
          label: "Home Assistant",
          position: "left",
          items: [
            {
              label: "概览",
              to: "docs/architecture_index",
            },
            {
              label: "核心",
              to: "docs/development_index",
            },
            { to: "docs/frontend", label: "前端" },
            { to: "docs/supervisor", label: "监督者" },
            { to: "docs/add-ons", label: "附加组件" },
            { to: "docs/operating-system", label: "操作系统" },
            { to: "docs/voice/overview", label: "语音" },
            { to: "docs/translations", label: "翻译" },
            { to: "docs/android", label: "安卓" },
          ],
        },
        { to: "docs/misc", label: "杂项", position: "left" },

      ],
    },
    footer: {
      logo: {
        alt: "Home Assistant",
        src: "img/logo-white.svg",
        height: "30px",
        href: "https://www.hasscn.top",
      },
      style: "dark",
      links: [
        {
          title: "更多 Home Assistant",
          items: [
            {
              label: "主页",
              href: "https://www.hasscn.top",
            },
            {
              label: "数据科学门户",
              href: "https://data.home-assistant.io",
            },
            {
              label: "警报",
              href: "https://alerts.home-assistant.io",
            },
            {
              label: "系统状态",
              href: "https://status.home-assistant.io/",
            },
          ],
        },
        {
          title: "社交",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/home-assistant",
            },


          ],
        },
        {
          title: "其他",
          items: [
            {
              label: "隐私",
              href: "https://www.home-assistant.io/privacy/",
            },
            {
              label: "安全",
              href: "https://www.home-assistant.io/security/",
            },
          ],
        },

      ],
      copyright: `版权所有 © ${new Date().getFullYear()} Home Assistant。由 Docusaurus 构建。`,
    },
    image: "img/default-social.png",
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/home-assistant/developers.home-assistant/edit/master/",
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        blog: {
          postsPerPage: 10,
          feedOptions: {
            type: "all",
          },
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};
