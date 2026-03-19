import type { ContentTemplate, ResumeData } from '../types/resume';
import { generateId } from '../utils/storage';

function createDefaultBasic() {
  return {
    name: '',
    phone: '',
    email: '',
    location: '',
    avatar: '',
    linkedin: '',
    github: '',
    website: '',
    title: '',
  };
}

export const contentTemplates: ContentTemplate[] = [
  {
    id: 'fresh-graduate',
    name: '应届生模板',
    icon: '👨‍🎓',
    description: '突出校园经历、实习、技能，适合应届毕业生',
    sectionOrder: ['education', 'experience', 'project', 'skills', 'summary'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '张三',
        title: '应届毕业生',
        phone: '138xxxx8888',
        email: 'zhangsan@example.com',
        location: '北京',
      },
      sections: [
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 0,
          items: [
            {
              id: generateId(),
              school: '北京大学',
              degree: '本科',
              major: '计算机科学与技术',
              startDate: '2020-09',
              endDate: '2024-06',
              description: 'GPA 3.8/4.0，获国家奖学金2次，校级优秀毕业生',
            },
          ],
        },
        {
          id: 'experience',
          type: 'experience',
          title: '实习经历',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              company: '某互联网公司',
              position: '产品实习生',
              startDate: '2023-06',
              endDate: '2023-09',
              description: '参与用户增长项目，负责数据分析和用户行为研究，通过A/B测试优化注册流程，转化率提升15%',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '校园项目',
          visible: true,
          order: 2,
          items: [
            {
              id: generateId(),
              projectName: '校园二手交易平台',
              role: '项目负责人',
              startDate: '2023-03',
              endDate: '2023-06',
              description: '带领5人团队开发校园二手交易平台，负责需求分析、产品设计和项目管理，上线后注册用户达2000+',
            },
          ],
        },
        {
          id: 'skills',
          type: 'skills',
          title: '技能特长',
          visible: true,
          order: 3,
          items: ['Office办公套件', 'Python', 'SQL', '数据分析', 'Axure', '英语CET-6'],
        },
        {
          id: 'summary',
          type: 'summary',
          title: '自我评价',
          visible: true,
          order: 4,
          items: '热爱学习，具备良好的沟通能力和团队协作精神。在校期间积极参与各类项目实践，具有较强的分析能力和解决问题的能力。',
        },
      ],
    },
  },
  {
    id: 'tech',
    name: '技术岗模板',
    icon: '💻',
    description: '突出技术栈、项目、GitHub，适合开发/测试等技术岗位',
    sectionOrder: ['skills', 'experience', 'project', 'education'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '李四',
        title: '前端开发工程师',
        phone: '139xxxx9999',
        email: 'lisi@example.com',
        location: '杭州',
        github: 'https://github.com/lisi',
      },
      sections: [
        {
          id: 'skills',
          type: 'skills',
          title: '技术栈',
          visible: true,
          order: 0,
          items: ['React', 'TypeScript', 'Node.js', 'Vue.js', 'Webpack', 'Docker', 'MySQL', 'Redis', 'Git', 'CI/CD'],
        },
        {
          id: 'experience',
          type: 'experience',
          title: '工作经历',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              company: '阿里巴巴',
              position: '高级前端开发工程师',
              startDate: '2021-07',
              endDate: '至今',
              description: '负责电商平台核心交易链路的前端架构设计与开发，主导微前端架构改造，页面加载速度提升40%，支撑日均千万级PV',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '项目经历',
          visible: true,
          order: 2,
          items: [
            {
              id: generateId(),
              projectName: '商家工作台重构',
              role: '技术负责人',
              startDate: '2022-03',
              endDate: '2022-09',
              description: '主导商家工作台从jQuery到React的技术栈迁移，设计组件库和状态管理方案，开发效率提升60%，Bug率降低35%',
            },
          ],
        },
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 3,
          items: [
            {
              id: generateId(),
              school: '浙江大学',
              degree: '硕士',
              major: '软件工程',
              startDate: '2018-09',
              endDate: '2021-06',
              description: '研究方向：Web前端性能优化',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'management',
    name: '管理岗模板',
    icon: '📊',
    description: '突出团队规模、管理方法论、业务结果数据',
    sectionOrder: ['experience', 'project', 'skills', 'education'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '王五',
        title: '产品总监',
        phone: '137xxxx7777',
        email: 'wangwu@example.com',
        location: '上海',
      },
      sections: [
        {
          id: 'experience',
          type: 'experience',
          title: '工作经历',
          visible: true,
          order: 0,
          items: [
            {
              id: generateId(),
              company: '某头部互联网公司',
              position: '产品总监',
              startDate: '2020-01',
              endDate: '至今',
              description: '管理15人产品团队，负责公司核心业务线产品规划与落地。年度OKR达成率120%，推动业务GMV同比增长45%，用户满意度从82%提升至93%',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '核心项目',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              projectName: '用户增长体系搭建',
              role: '项目总负责人',
              startDate: '2021-01',
              endDate: '2021-12',
              description: '从0到1搭建用户增长体系，协调产品、运营、技术三个团队共20人，实现新用户获取成本降低30%，月活用户增长200%',
            },
          ],
        },
        {
          id: 'skills',
          type: 'skills',
          title: '核心能力',
          visible: true,
          order: 2,
          items: ['团队管理', '产品规划', 'OKR管理', '跨部门协作', '数据驱动决策', '用户增长'],
        },
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 3,
          items: [
            {
              id: generateId(),
              school: '复旦大学',
              degree: 'MBA',
              major: '工商管理',
              startDate: '2017-09',
              endDate: '2019-06',
              description: '',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'data-product',
    name: '数据产品模板',
    icon: '📈',
    description: '突出数据产品设计能力、指标体系搭建、数据需求文档产出',
    sectionOrder: ['experience', 'project', 'skills', 'education'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '赵六',
        title: '数据产品经理',
        phone: '136xxxx6666',
        email: 'zhaoliu@example.com',
        location: '北京',
      },
      sections: [
        {
          id: 'experience',
          type: 'experience',
          title: '工作经历',
          visible: true,
          order: 0,
          items: [
            {
              id: generateId(),
              company: '某电商平台',
              position: '高级数据产品经理',
              startDate: '2021-03',
              endDate: '至今',
              description: '负责公司数据中台产品规划与建设，搭建统一指标体系覆盖200+核心业务指标，设计并落地自助分析平台，日均使用人数从50提升至500+，数据需求响应效率提升70%',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '项目经历',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              projectName: '统一指标管理平台',
              role: '产品负责人',
              startDate: '2022-01',
              endDate: '2022-08',
              description: '从0到1设计指标管理平台，统一全公司指标口径，解决数据不一致问题。覆盖5大业务线200+指标，减少80%的指标口径争议，数据报表产出效率提升50%',
            },
          ],
        },
        {
          id: 'skills',
          type: 'skills',
          title: '技能特长',
          visible: true,
          order: 2,
          items: ['数据产品设计', '指标体系', 'BI工具', 'SQL', '数据治理', '用户行为分析', 'Tableau', 'Python'],
        },
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 3,
          items: [
            {
              id: generateId(),
              school: '清华大学',
              degree: '硕士',
              major: '数据科学',
              startDate: '2017-09',
              endDate: '2020-06',
              description: '',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'data-analyst',
    name: '数据分析模板',
    icon: '🔍',
    description: '突出分析方法论、业务洞察能力、工具熟练度',
    sectionOrder: ['skills', 'experience', 'project', 'education'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '孙七',
        title: '数据分析师',
        phone: '135xxxx5555',
        email: 'sunqi@example.com',
        location: '杭州',
      },
      sections: [
        {
          id: 'skills',
          type: 'skills',
          title: '技能特长',
          visible: true,
          order: 0,
          items: ['SQL', 'Python', 'R', 'Tableau', '数据可视化', 'A/B测试', '统计分析', 'Excel高级', 'Hive', 'Spark'],
        },
        {
          id: 'experience',
          type: 'experience',
          title: '工作经历',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              company: '某互联网公司',
              position: '高级数据分析师',
              startDate: '2020-07',
              endDate: '至今',
              description: '负责用户增长方向的数据分析工作，通过用户分层分析发现高价值用户特征，指导运营策略调整，用户留存率提升12%。建立自动化数据监控体系，覆盖50+核心指标，异常发现时效从T+1缩短至实时',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '分析项目',
          visible: true,
          order: 2,
          items: [
            {
              id: generateId(),
              projectName: '用户流失预警模型',
              role: '分析负责人',
              startDate: '2022-06',
              endDate: '2022-10',
              description: '基于用户行为数据构建流失预警模型，使用逻辑回归+随机森林方法，AUC达0.85。模型上线后提前识别高流失风险用户，配合运营干预，月度流失率降低8个百分点',
            },
          ],
        },
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 3,
          items: [
            {
              id: generateId(),
              school: '中国人民大学',
              degree: '硕士',
              major: '统计学',
              startDate: '2017-09',
              endDate: '2020-06',
              description: '',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'data-ops',
    name: '数据运营模板',
    icon: '🎯',
    description: '突出运营策略设计、数据驱动增长、A/B实验、用户分层',
    sectionOrder: ['experience', 'project', 'skills', 'education'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '周八',
        title: '数据运营专家',
        phone: '134xxxx4444',
        email: 'zhouba@example.com',
        location: '深圳',
      },
      sections: [
        {
          id: 'experience',
          type: 'experience',
          title: '工作经历',
          visible: true,
          order: 0,
          items: [
            {
              id: generateId(),
              company: '某头部电商平台',
              position: '高级数据运营',
              startDate: '2020-04',
              endDate: '至今',
              description: '负责平台用户增长与留存的数据运营工作，设计并执行用户分层运营策略，通过精细化运营将核心用户群体月活提升25%。主导30+场A/B实验，累计带来GMV增长1200万',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '项目经历',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              projectName: '用户生命周期运营体系',
              role: '项目负责人',
              startDate: '2021-09',
              endDate: '2022-03',
              description: '搭建用户生命周期运营体系，基于RFM模型将用户分为8个层级，针对不同层级设计差异化运营策略。新用户7日留存率提升18%，沉默用户召回率提升35%',
            },
          ],
        },
        {
          id: 'skills',
          type: 'skills',
          title: '技能特长',
          visible: true,
          order: 2,
          items: ['用户分层', 'A/B实验', '增长策略', '数据运营', '精细化运营', '留存分析', 'SQL', 'Python', 'Tableau'],
        },
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 3,
          items: [
            {
              id: generateId(),
              school: '武汉大学',
              degree: '本科',
              major: '市场营销',
              startDate: '2016-09',
              endDate: '2020-06',
              description: '',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'strategy-product',
    name: '策略产品模板',
    icon: '🧠',
    description: '突出算法策略设计、推荐/风控/定价等策略产品经验',
    sectionOrder: ['experience', 'project', 'skills', 'education'],
    sampleData: {
      basic: {
        ...createDefaultBasic(),
        name: '吴九',
        title: '策略产品经理',
        phone: '133xxxx3333',
        email: 'wujiu@example.com',
        location: '北京',
      },
      sections: [
        {
          id: 'experience',
          type: 'experience',
          title: '工作经历',
          visible: true,
          order: 0,
          items: [
            {
              id: generateId(),
              company: '某头部互联网公司',
              position: '高级策略产品经理',
              startDate: '2020-08',
              endDate: '至今',
              description: '负责搜索推荐策略产品的规划与落地，与算法团队紧密协作，设计推荐策略迭代方案。主导个性化推荐策略优化，CTR提升22%，人均浏览时长增长15%，直接带动日均GMV增长800万',
            },
          ],
        },
        {
          id: 'project',
          type: 'project',
          title: '项目经历',
          visible: true,
          order: 1,
          items: [
            {
              id: generateId(),
              projectName: '智能定价策略系统',
              role: '策略产品负责人',
              startDate: '2022-01',
              endDate: '2022-08',
              description: '设计并落地智能定价策略系统，基于供需关系、竞品价格、用户价格敏感度等多维度因子，实现动态定价。上线后毛利率提升3个百分点，订单量无明显下降',
            },
          ],
        },
        {
          id: 'skills',
          type: 'skills',
          title: '技能特长',
          visible: true,
          order: 2,
          items: ['推荐系统', '风控策略', '定价策略', '算法产品', 'A/B实验', '机器学习基础', 'SQL', 'Python'],
        },
        {
          id: 'education',
          type: 'education',
          title: '教育经历',
          visible: true,
          order: 3,
          items: [
            {
              id: generateId(),
              school: '北京航空航天大学',
              degree: '硕士',
              major: '计算机科学',
              startDate: '2016-09',
              endDate: '2019-06',
              description: '研究方向：推荐系统与信息检索',
            },
          ],
        },
      ],
    },
  },
];

export function createEmptyResume(contentTemplateId: string, visualTemplateId: string): ResumeData {
  const contentTemplate = contentTemplates.find((template) => template.id === contentTemplateId);

  const resumeId = generateId();
  const defaultBasic = createDefaultBasic();

  if (contentTemplate?.sampleData) {
    return {
      meta: {
        id: resumeId,
        name: contentTemplate.name,
        visualTemplateId,
        contentTemplateId,
        themeColor: '',
        updatedAt: new Date().toISOString(),
      },
      basic: contentTemplate.sampleData.basic
        ? { ...defaultBasic, ...contentTemplate.sampleData.basic }
        : defaultBasic,
      sections: (contentTemplate.sampleData.sections as ResumeData['sections']) ?? [],
    };
  }

  return {
    meta: {
      id: resumeId,
      name: '我的简历',
      visualTemplateId,
      contentTemplateId,
      themeColor: '',
      updatedAt: new Date().toISOString(),
    },
    basic: defaultBasic,
    sections: [
      {
        id: 'education',
        type: 'education',
        title: '教育经历',
        visible: true,
        order: 0,
        items: [],
      },
      {
        id: 'experience',
        type: 'experience',
        title: '工作经历',
        visible: true,
        order: 1,
        items: [],
      },
      {
        id: 'skills',
        type: 'skills',
        title: '技能特长',
        visible: true,
        order: 2,
        items: [],
      },
      {
        id: 'summary',
        type: 'summary',
        title: '自我评价',
        visible: true,
        order: 3,
        items: '',
      },
    ],
  };
}
