export const QUESTIONS = [
    {
        name: "愚者的天真",
        text: "你站在悬崖边，脚下是未知的迷雾。你会？",
        dim: "belief",
        opts: [
            { val: 5, text: "纵身一跃，拥抱未知的冒险" },
            { val: 2, text: "先仔细观察，寻找相对安全的路径" },
            { val: 1, text: "转身离开，选择已知的安稳" }
        ]
    },
    {
        name: "魔术师的梦想",
        text: "你获得了一次许愿的机会，但只能实现一个愿望。你会选择？",
        dim: "belief",
        opts: [
            { val: 5, text: "世界和平，人人幸福" },
            { val: 2, text: "获得改变世界的智慧与能力" },
            { val: 1, text: "拥有无忧无虑的富足生活" }
        ]
    },
    {
        name: "女祭司的仁慈",
        text: "一位曾经伤害过你的人现在落难向你求助。你会？",
        dim: "empathy",
        opts: [
            { val: 5, text: "不计前嫌，全力帮助" },
            { val: 2, text: "提供基本帮助，但保持距离" },
            { val: 1, text: "婉言拒绝，但内心不安" }
        ]
    },
    {
        name: "女皇的优雅",
        text: "你希望自己留给别人的第一印象是？",
        dim: "empathy",
        opts: [
            { val: 5, text: "温暖如春，让人如沐春风" },
            { val: 2, text: "稳重得体，值得信赖" },
            { val: 1, text: "干练果断，能力出众" }
        ]
    },
    {
        name: "皇帝的威严",
        text: "当你制定了一个计划，却发现手下有人公然反对。你会？",
        dim: "action",
        opts: [
            { val: 5, text: "坚持己见，要求执行" },
            { val: 2, text: "听取意见后折中调整" },
            { val: 1, text: "重新讨论，寻求共识" }
        ]
    },
    {
        name: "法皇的法则",
        text: "你认为法律与道德的关系应该是？",
        dim: "principle",
        opts: [
            { val: 5, text: "法律必须体现道德准则" },
            { val: 2, text: "法律应保持独立，参考道德" },
            { val: 1, text: "法律就是法律，与道德分离" }
        ]
    },
    {
        name: "恋人的亲密",
        text: "在亲密关系中，你最看重的是？",
        dim: "empathy",
        opts: [
            { val: 5, text: "无条件的信任与陪伴" },
            { val: 2, text: "共同成长与相互支持" },
            { val: 1, text: "彼此独立又互相尊重" }
        ]
    },
    {
        name: "战车的行进",
        text: "当你遇到一个必须快速决断的危机时，你会？",
        dim: "action",
        opts: [
            { val: 5, text: "立刻行动，边做边调整" },
            { val: 2, text: "快速评估风险后行动" },
            { val: 1, text: "先稳住局面，再收集信息" }
        ]
    },
    {
        name: "力量的源泉",
        text: "你认为真正的力量来源于？",
        dim: "empathy",
        opts: [
            { val: 5, text: "爱与守护他人的信念" },
            { val: 2, text: "智慧与策略的运用" },
            { val: 1, text: "坚韧不拔的意志" }
        ]
    },
    {
        name: "隐者的寂静",
        text: "当你感到迷茫时，你通常会？",
        dim: "confidence",
        opts: [
            { val: 5, text: "独自安静思考，寻找内心答案" },
            { val: 2, text: "与一两位挚友倾诉交流" },
            { val: 1, text: "通过行动来驱散迷茫" }
        ]
    },
    {
        name: "命运的抉择",
        text: "你相信“命中注定”吗？",
        dim: "belief",
        opts: [
            { val: 5, text: "命运掌握在自己手中" },
            { val: 2, text: "命运与努力各占一半" },
            { val: 1, text: "有些事确实命中注定" }
        ]
    },
    {
        name: "正义的裁决",
        text: "如果你目睹朋友做了一件不道德但未违法的事，你会？",
        dim: "principle",
        opts: [
            { val: 5, text: "当面指出，要求他改正" },
            { val: 2, text: "委婉提醒，希望他自省" },
            { val: 1, text: "内心不认同，但不会干涉" }
        ]
    },
    {
        name: "倒吊人的奉献",
        text: "为了集体利益，你愿意牺牲个人利益到什么程度？",
        dim: "principle",
        opts: [
            { val: 5, text: "愿意做出重大牺牲" },
            { val: 2, text: "愿意做出适度让步" },
            { val: 1, text: "尽量兼顾，不愿牺牲" }
        ]
    },
    {
        name: "死神的呢喃",
        text: "当你面临一次彻底的失败，你的第一反应是？",
        dim: "confidence",
        opts: [
            { val: 5, text: "视作新的开始，反而轻松" },
            { val: 2, text: "痛苦但会尽快振作" },
            { val: 1, text: "需要时间消化，但会走出来" }
        ]
    },
    {
        name: "节制的欲望",
        text: "面对诱人的美食，但你知道自己正在减肥。你会？",
        dim: "principle",
        opts: [
            { val: 5, text: "坚决不吃，遵守计划" },
            { val: 2, text: "吃一小口解馋，然后控制" },
            { val: 1, text: "偶尔破例，之后加倍运动" }
        ]
    },
    {
        name: "恶魔的诱惑",
        text: "如果有一个机会可以让你获得巨大成功，但需要欺骗一位无辜的人。你会？",
        dim: "belief",
        opts: [
            { val: 5, text: "断然拒绝，坚守底线" },
            { val: 2, text: "犹豫后拒绝，但内心挣扎" },
            { val: 1, text: "考虑是否有两全其美的办法" }
        ]
    },
    {
        name: "高塔的毁灭",
        text: "当你突然失去了一切（财富、地位、社交），你会如何重建？",
        dim: "action",
        opts: [
            { val: 5, text: "立刻行动起来，从最紧急的事情开始重建" },
            { val: 2, text: "按部就班，优先处理重要且可行的事务" },
            { val: 1, text: "先冷静反思，制定详细计划后再行动" }
        ]
    },
    {
        name: "星星的指引",
        text: "你对未来的期待是？",
        dim: "confidence",
        opts: [
            { val: 5, text: "充满希望，相信一切会越来越好" },
            { val: 2, text: "保持谨慎乐观，相信努力会有回报" },
            { val: 1, text: "接受不确定性，顺其自然就好" }
        ]
    },
    {
        name: "月亮的盈亏",
        text: "你更相信直觉还是逻辑？",
        dim: "empathy",
        opts: [
            { val: 5, text: "直觉，我的第六感很准" },
            { val: 2, text: "两者结合，灵活运用" },
            { val: 1, text: "逻辑，理性分析最可靠" }
        ]
    },
    {
        name: "太阳的光芒",
        text: "你希望自己在人群中是怎样的存在？",
        dim: "action",
        opts: [
            { val: 5, text: "闪耀的焦点，照亮他人" },
            { val: 2, text: "温暖的支持者，默默帮助" },
            { val: 1, text: "安静的观察者，保持独立" }
        ]
    },
    {
        name: "审判者的救赎",
        text: "当你评判一个人的价值时，你更看重他的内在品质还是外在成就？",
        dim: "weight_mix1",
        opts: [
            { val: 5, text: "内在品质，善良和正直是最重要的", weightEffect: { belief: 1.3, empathy: 1.2 } },
            { val: 3, text: "两者都重要，会根据具体情况判断", weightEffect: { belief: 1.0, empathy: 1.0 } },
            { val: 1, text: "外在成就，因为结果更能说明问题", weightEffect: { belief: 0.7, empathy: 0.8 } }
        ]
    },
    {
        name: "世界的指向",
        text: "在团队合作中，你认为规则和效率哪个更重要？",
        dim: "weight_mix2",
        opts: [
            { val: 5, text: "效率优先，结果比过程更重要", weightEffect: { action: 1.3, principle: 0.7 } },
            { val: 3, text: "规则和效率兼顾，根据情况调整", weightEffect: { action: 1.0, principle: 1.0 } },
            { val: 1, text: "规则优先，按流程办事更稳妥", weightEffect: { action: 0.7, principle: 1.3 } }
        ]
    }
];