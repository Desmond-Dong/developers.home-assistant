import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const recentPosts = require("../../.docusaurus/docusaurus-plugin-content-blog/default/blog-post-list-prop-default.json");
const features = [
  {
    title: <>文档结构</>,
    imageUrl: "",
    description: (
      <>
        <p>
          <b>
            <a href="docs/architecture_index">概览</a>.
          </b>{" "}
          解释构成 Home Assistant 的各个层。
        </p>
        <p>
          <b>
            <a href="docs/development_index">核心</a>.
          </b>{" "}
          解释如何为 Home Assistant 构建新的集成。
        </p>
        <p>
          <b>
            <a href="docs/frontend">前端</a>.
          </b>{" "}
          解释如何开发 Home Assistant 的用户界面。
        </p>
        <p>
          <b>
            <a href="docs/android">安卓</a>.
          </b>{" "}
          解释如何为 Android 伴侣应用做出贡献。
        </p>
      </>
    ),
  },
  {
    title: <>热门主题</>,
    imageUrl: "",
    description: (
      <>
        <ul style={{ flex: "1" }}>
          <li>
            <a href="docs/development_index">添加一个新集成</a>
          </li>
          <li>
            <a href="docs/internationalization">翻译 Home Assistant</a>
          </li>
          <li>
            <a href="docs/api/websocket">Home Assistant API</a>
          </li>
        </ul>
        <h3>源代码</h3>
        <ul>
          <li>
            <a href="https://github.com/home-assistant/core">
              Home Assistant 核心
            </a>
          </li>
          <li>
            <a href="https://github.com/home-assistant/frontend">
              Home Assistant 前端
            </a>
          </li>
          <li>
            <a href="https://github.com/home-assistant/android">
              Home Assistant 安卓
            </a>
          </li>
        </ul>
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--3", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`Home Assistant 开发者文档`}
      description="开始为 Home Assistant 开发"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className={clsx("col col--10")}>
              <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
              <p className={styles.heroTagline}>{siteConfig.tagline}</p>
              <p>
                <a
                  className={styles.heroText}
                  href="https://www.hasscn.top"
                >
                  不是开发者？前往普通网站
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
