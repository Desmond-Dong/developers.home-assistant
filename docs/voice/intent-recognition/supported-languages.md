---
title: "支持的语言"
---

import languages from '!!yaml-loader!../../../intents/languages.yaml';
import intents from '!!yaml-loader!../../../intents/intents.yaml';

如果您在下面没有看到您的语言，[请帮助我们翻译!](/docs/voice/intent-recognition/contributing)

有关每种语言的完整进度报告，[点击这里。](https://home-assistant.github.io/intents/)

<>
  <table>
    <thead>
      <tr>
        <th>代码</th>
        <th>语言</th>
        <th>负责人</th>
        <th>链接</th>
      </tr>
    </thead>
    <tbody>
      {
        Object.entries(languages).map(
          ([language, info]) =>
            <tr>
              <td>
                <code>{language}</code>
              </td>
              <td>
                {info.nativeName}
              </td>
              <td>
                {info.leaders?.length &&
                    info.leaders.map((leader, idx) =>
                      <>
                        {!!idx && ', '}
                        <a href={`https://github.com/${leader}`}>{leader}</a>
                      </>
                    )}
              </td>
              <td>
                <a href={`https://github.com/home-assistant/intents/tree/main/sentences/${language}`}>句子</a>
              </td>
            </tr>
        )
      }
    </tbody>
  </table>
</>

[该页面是基于 Intents 仓库自动生成的。](https://github.com/home-assistant/intents/blob/main/languages.yaml)