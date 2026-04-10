/**
 * LPMI 人格测试 — 20 题完整计分版
 * - 选项分值仅用于脚本累加，不在页面展示。
 * - 人格判定：getPersonalityCode（优先级与阈值见同文件内注释）。
 */

const DIMENSIONS = {
  L: { left: '考古', right: '当下', code: 'L' },
  P: { left: '脑补', right: '所见即所得', code: 'P' },
  M: { left: '铁证', right: '同框即婚', code: 'M' },
  I: { left: '发癫', right: '冷静', code: 'I' },
};

const DIM_KEYS = ['L', 'P', 'M', 'I'];

/** @type {{ text: string, options: Record<string, { label: string } & Partial<Record<'L'|'P'|'M'|'I', number>>>}[]} */
const questions = [
  {
    text: '你在餐厅点菜，服务员说“这个菜比较慢”，你说“没事我能等”。四十分钟过去了，你会？',
    options: {
      A: { label: '继续等，都等这么久了现在走不是亏了', L: 2, I: -2 },
      B: { label: '催服务员，催完继续等', M: 2, I: -1 },
      C: { label: '脑补后厨正在为你的菜发生什么精彩故事', P: 3, I: 2 },
      D: { label: '站起来就走，我的时间不是时间？', L: -2, P: -2 },
    },
  },
  {
    text: '朋友发来一条59秒的语音，你会？',
    options: {
      A: { label: '转文字，提炼中心思想', M: 3, L: -2, I: -1 },
      B: { label: '收藏，等有空再听，然后永远没空', L: 3, I: -2 },
      C: { label: '听完，并针对其中第三秒的某个语气词展开分析', P: 3, M: 2, I: 1 },
      D: { label: '回一个“6”', P: -2, M: -2, I: 1 },
    },
  },
  {
    text: '你发现你和前任的现女友用了同款手机壳，你会？',
    options: {
      A: { label: '立刻换掉，晦气', L: -2, P: -2 },
      B: { label: '截图发给朋友，标题“来活儿了”', I: 3, M: -2 },
      C: { label: '研究她什么时候买的、是不是故意的', M: 3, L: 2, I: -1 },
      D: { label: '无所谓，说明这款手机壳确实好看', I: -2, P: -2 },
    },
  },
  {
    text: '凌晨三点你突然醒了，你会？',
    options: {
      A: { label: '上厕所，喝水，继续睡', P: -2, I: -2 },
      B: { label: '打开手机，然后两小时过去了', L: 3, I: 2 },
      C: { label: '脑子里开始自动播放人生走马灯', P: 3, L: 2, I: 1 },
      D: { label: '觉得这个时间点醒来一定有宇宙的深意', P: 3, M: -2, I: 2 },
    },
  },
  {
    text: '你去超市买水果，挑水果的方式是？',
    options: {
      A: { label: '逐个拿起来看、捏、闻', M: 3, L: -2 },
      B: { label: '随便抓几个，差不多就行', P: -2, I: -2 },
      C: { label: '先看别人怎么挑，然后学他', L: 2, I: -1 },
      D: { label: '不挑，直接买切好的果盘', L: -2, I: 2 },
    },
  },
  {
    text: '同事/同学在群里发了一个红包，你抢到了0.01元，你会？',
    options: {
      A: { label: '发一个“谢谢老板”的表情包', I: -2, P: -2 },
      B: { label: '截图发朋友圈，配文“这就是命”', I: 3, M: -2 },
      C: { label: '私聊抢到最大红包的人，问他什么姿势抢的', M: 3, P: 2, I: 1 },
      D: { label: '不说话，默默记下这个人的手气，下次他发红包你再抢', L: 3, I: -2 },
    },
  },
  {
    text: '你洗澡时听歌，歌切到了一首很悲的歌，你会？',
    options: {
      A: { label: '切掉，洗澡要听嗨的', L: -2, I: 2 },
      B: { label: '跟着唱，唱到动情处花洒当麦克风', I: 3, M: -2 },
      C: { label: '陷入沉思，开始脑补自己是MV主角', P: 3, L: 2, I: 1 },
      D: { label: '洗完澡去查这首歌的创作背景', M: 3, L: -2, I: -1 },
    },
  },
  {
    text: '别人跟你说“你知道吗”，然后说了一件你早就知道的事，你会？',
    options: {
      A: { label: '礼貌微笑：“哦是吗”', I: -2, P: -2 },
      B: { label: '“我知道，而且我还知道”——然后开始补充细节', M: 3, L: 3 },
      C: { label: '假装不知道，让他说完，享受观察人类的乐趣', P: 3, I: -1 },
      D: { label: '“你才知道啊？”', I: 2, L: -2 },
    },
  },
  {
    text: '你被拉去玩狼人杀/剧本杀，你通常？',
    options: {
      A: { label: '认真做笔记，时间线整理得比法官还清楚', M: 3, L: -2, I: -1 },
      B: { label: '全程划水，但最后投对人了', I: -2, P: -2 },
      C: { label: '编了一套完整的身世故事，把所有人骗了', P: 3, I: 2 },
      D: { label: '第一轮就被投出去，然后在旁边看戏', L: 2, I: -2 },
    },
  },
  {
    text: '你手机里有多少个没点开的微信红点？',
    options: {
      A: { label: '零，看见红点必须点掉', I: 2, M: 3 },
      B: { label: '两位数，习惯了', I: -2, P: -2 },
      C: { label: '三位数，已经放弃治疗', L: 3, I: -2 },
      D: { label: '我甚至不知道红点是什么意思，我把微信通知关了', P: 2, I: -2 },
    },
  },
  {
    text: '你看综艺看到煽情环节开始放BGM，你会？',
    options: {
      A: { label: '眼眶湿润，但假装没哭', I: -1, P: 2 },
      B: { label: '快进，我是来找乐子的不是来哭的', L: -2, P: -2 },
      C: { label: '哭得比嘉宾还惨', I: 3, M: -2 },
      D: { label: '分析这段剪辑用了几个机位', M: 3, L: 2, I: -2 },
    },
  },
  {
    text: '你去吃自助餐，你的策略是？',
    options: {
      A: { label: '先巡视一圈，规划路线再拿', M: 3, L: -2, I: -1 },
      B: { label: '直奔最贵的，吃回本', L: -2, I: -1 },
      C: { label: '每样拿一点，摆盘拍照', P: -2, I: 2 },
      D: { label: '帮全桌人拿吃的，自己最后吃', I: -2, L: 2 },
    },
  },
  {
    text: '你发现你的朋友偷偷把你的微信备注改成了“大怨种”，你会？',
    options: {
      A: { label: '改回去，并截图留证', M: 3, L: 2, I: -1 },
      B: { label: '把他的备注改成“大怨种之子”', I: 3, P: 2 },
      C: { label: '反思自己是不是真的有点怨种', P: 3, I: -2 },
      D: { label: '无所谓，备注而已', P: -2, I: -2 },
    },
  },
  {
    text: '半夜饿了，你会？',
    options: {
      A: { label: '打开外卖软件，刷半小时，然后关了睡觉', I: -2, L: 2 },
      B: { label: '起床煮泡面，加蛋加肠，仪式感拉满', I: 3, P: 2 },
      C: { label: '打开冰箱，有什么吃什么', P: -2, L: -2 },
      D: { label: '发朋友圈“有没有人出来吃宵夜”', I: 3, M: -2 },
    },
  },
  {
    text: '你朋友圈的可见范围是？',
    options: {
      A: { label: '全部可见，坦坦荡荡', P: -2, I: 2 },
      B: { label: '三天可见，保持神秘', I: -1, L: -2 },
      C: { label: '分组可见，每条朋友圈都有不同的观众', M: 3, P: 3 },
      D: { label: '半年可见，因为懒得改', L: 3, I: -2 },
    },
  },
  {
    text: '朋友跟你吐槽他的感情问题，你通常会？',
    options: {
      A: { label: '耐心听完，然后说“那你打算怎么办”', I: -2, M: 2 },
      B: { label: '跟着一起骂对方，骂得比他还狠', I: 3, M: -2 },
      C: { label: '帮他分析这段关系的底层逻辑', P: 3, M: 3, I: -1 },
      D: { label: '听完说“我早就觉得他不靠谱”', L: 3, I: -1 },
    },
  },
  {
    text: '你看到路边有人在吵架，你会？',
    options: {
      A: { label: '快步走过，不关我事', P: -2, I: -2 },
      B: { label: '放慢脚步，听一耳朵', M: 2, I: -1 },
      C: { label: '脑补他们吵架的原因和后续', P: 3, L: -2, I: 1 },
      D: { label: '拍下来发群里“有瓜速来”', I: 3, M: -2 },
    },
  },
  {
    text: '你最喜欢的网络梗是哪种类型？',
    options: {
      A: { label: '阴阳怪气型（比如“啊对对对”）', I: -1, P: 2 },
      B: { label: '发疯文学型（比如“尖叫扭曲爬行”）', I: 3, M: -2 },
      C: { label: '废话文学型（比如“听君一席话如听一席话”）', P: -2, I: -1 },
      D: { label: '考古型（别人都忘了的梗你还在玩）', L: 3, M: 2 },
    },
  },
  {
    text: '你的购物车通常的状态是？',
    options: {
      A: { label: '空的，买完就清', L: -2, P: -2 },
      B: { label: '加了一堆，但很少下单', L: 3, I: -2 },
      C: { label: '加了一堆，半夜冲动下单', I: 3, M: -2 },
      D: { label: '购物车分类整理，比商店还整齐', M: 3, P: 2, I: -2 },
    },
  },
  {
    text: '测完这个测试，你会？',
    options: {
      A: { label: '截图发朋友圈，配文“我是这个？”', I: 3, M: -2 },
      B: { label: '再测一遍，看看能不能测出别的', M: 3, P: 2 },
      C: { label: '研究题目和结果之间的关系', P: 3, L: 2, I: -1 },
      D: { label: '测完就关，不留一片云彩', P: -2, I: -2 },
    },
  },
];

/**
 * 20 种人格（按 code 索引）。image 可填 'assets/personas/xxx.png'
 */
const PERSONAS_BY_CODE = {
  CHLL: {
    code: 'CHLL',
    name: '死机',
    tagline: '你嗑CP像冰箱制冷——稳定、恒温、不声不响。有糖就存，没糖拉倒。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  BOIL: {
    code: 'BOIL',
    name: '沸物',
    tagline: '你是一锅随时烧开的水。同框一次你能叫三天，凉完下次还炸。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  JUDG: {
    code: 'JUDG',
    name: '杠精',
    tagline: '没实锤不开口，开口就是判决书。证据不足，退回补充侦查。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  SIRN: {
    code: 'SIRN',
    name: '哑炮',
    tagline: '平时安静如鸡，实锤一到立刻拉响警报，你是全村最大的声音。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  MIST: {
    code: 'MIST',
    name: '闷骚',
    tagline: '脑子里写完了他们的八辈子，外表看起来只是在发呆。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  SWEET: {
    code: 'SWEET',
    name: '甜党',
    tagline: '脑补功率爆表：糖在脑子里先发酵一遍，表面还能装没事。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  STOM: {
    code: 'STOM',
    name: '戏精',
    tagline: 'L、M 冷静下线时，P 和 I 在台上抢戏，全场都是你的镜头。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  VAUL: {
    code: 'VAUL',
    name: '囤癖',
    tagline: '脑补完自己找证据验证，验证完存进档案库。大脑是加密硬盘。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  FREN: {
    code: 'FREN',
    name: '上头',
    tagline: '当下线 L 在休息，P/M/I 合力把油门踩到底，总分高到像开挂。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  MOSS: {
    code: 'MOSS',
    name: '钉子户',
    tagline: '你长在那了。不声不响，但一直都在。你只是不走而已。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  ECHO: {
    code: 'ECHO',
    name: '复读机',
    tagline: '同一个旧糖你能反复叫。三个月前叫过，今天想起来又叫一次。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  ARCH: {
    code: 'ARCH',
    name: '考据',
    tagline: '你在给CP写编年史。每一颗糖都有时间地点出处。档案馆馆长。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  LOOP: {
    code: 'LOOP',
    name: '卡带',
    tagline: '同一个镜头看了一百遍，每次都觉得发现了新东西。播放器只有重播键。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  ROOT: {
    code: 'ROOT',
    name: '蹲坑',
    tagline: '表面啥也没有，底下根扎了八米深。盘出了包浆但从不出土。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  HUSK: {
    code: 'HUSK',
    name: '空转',
    tagline: '脑补开到最大档，证据线偶尔掉线，但情绪与考古还在往前滚。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  MONK: {
    code: 'MONK',
    name: '念经',
    tagline: '反复盘旧糖、写分析、找证据，从不外传。嗑CP像修行。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  FURY: {
    code: 'FURY',
    name: '炸毛',
    tagline: '四维全在高位，情绪再点一把火——全场都能听见你的雷达在响。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  CHAF: {
    code: 'CHAF',
    name: '渣男',
    tagline: '路过什么嗑什么，嗑完就忘。风一吹就飘到下一片地。问就是嗑过，忘了是谁。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  TAP: {
    code: 'TAP',
    name: '手速',
    tagline: '证据门槛在线，情绪也在线：先找锤再尖叫，两手都要硬。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
  BARK: {
    code: 'BARK',
    name: '狗叫',
    tagline: '主页只有三种内容：啊啊啊、呜呜呜、图。你是人形开水壶，守着地的小狗。',
    detailL: '——',
    detailP: '——',
    detailM: '——',
    detailI: '——',
    image: '',
  },
};

function computeBounds() {
  const min = { L: 0, P: 0, M: 0, I: 0 };
  const max = { L: 0, P: 0, M: 0, I: 0 };
  for (const q of questions) {
    const keys = Object.keys(q.options);
    for (const dim of DIM_KEYS) {
      let lo = Infinity;
      let hi = -Infinity;
      for (const k of keys) {
        const v = q.options[k][dim] ?? 0;
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      }
      min[dim] += lo;
      max[dim] += hi;
    }
  }
  return { min, max };
}

const BOUNDS = computeBounds();

function percentForDim(raw, dim) {
  const lo = BOUNDS.min[dim];
  const hi = BOUNDS.max[dim];
  if (hi === lo) return 50;
  return ((raw - lo) / (hi - lo)) * 100;
}

function scoreAnswers(answers) {
  const raw = { L: 0, P: 0, M: 0, I: 0 };
  answers.forEach((choiceKey, i) => {
    const q = questions[i];
    const opt = q.options[choiceKey];
    if (!opt) return;
    for (const dim of DIM_KEYS) {
      raw[dim] += opt[dim] ?? 0;
    }
  });
  const pct = {};
  for (const dim of DIM_KEYS) {
    pct[dim] = Math.round(percentForDim(raw[dim], dim) * 10) / 10;
  }
  return { raw, pct };
}

/**
 * 根据四维原始分返回人格代号（英文）。
 * 优先级：BARK → SWEET → FREN → FURY → HUSK → SIRN → ARCH → TAP → CHAF → CHLL → 常规组合 → BOIL 兜底。
 */
function getPersonalityCode(scores) {
  const { L, P, M, I } = scores;

  if (I >= 15 && M < 0) return 'BARK';
  if (P >= 15 && L < 0 && M < 0 && I < 0) return 'SWEET';
  if (L < 0 && P >= 0 && M >= 0 && I >= 0 && P + M + I >= 20) return 'FREN';
  if (L >= 0 && P >= 0 && M >= 0 && I >= 10) return 'FURY';
  if (P >= 15 && L >= 0 && M < 0 && I >= 0) return 'HUSK';
  if (L < 0 && P < 0 && M < 0 && I >= 10) return 'SIRN';
  if (L >= 0 && M >= 10 && P < 0 && I < 0) return 'ARCH';
  if (L < 0 && P < 0 && M >= 8 && I >= 0) return 'TAP';
  if (Math.abs(L) <= 5 && Math.abs(P) <= 5 && M < 0 && I >= 0) return 'CHAF';

  if (L < 0 && P < 0 && M < 0 && I < -5) return 'CHLL';
  if (L < 0 && P < 0 && M < 0 && I >= 0) return 'BOIL';
  if (L < 0 && P < 0 && M >= 0 && I < 0) return 'JUDG';
  if (L < 0 && P >= 0 && M < 0 && I < 0) return 'MIST';
  if (L < 0 && P >= 0 && M < 0 && I >= 0) return 'STOM';
  if (L < 0 && P >= 0 && M >= 0 && I < 0) return 'VAUL';
  if (L >= 0 && P < 0 && M < 0 && I < 0) return 'MOSS';
  if (L >= 0 && P < 0 && M < 0 && I >= 0) return 'ECHO';
  if (L >= 0 && P < 0 && M >= 0 && I >= 0) return 'LOOP';
  if (L >= 0 && P >= 0 && M < 0 && I < 0) return 'ROOT';
  if (L >= 0 && P >= 0 && M >= 0 && I < 0) return 'MONK';

  return 'BOIL';
}

function pickPersona(raw) {
  const code = getPersonalityCode(raw);
  return PERSONAS_BY_CODE[code] || PERSONAS_BY_CODE.BOIL;
}

function renderQuiz() {
  const total = questions.length;
  document.getElementById('total-q').textContent = String(total);
  let index = 0;
  const answers = [];

  function showQuestion() {
    const q = questions[index];
    document.getElementById('q-index').textContent = String(index + 1);
    document.getElementById('q-text').textContent = q.text;
    const pct = ((index + 1) / total) * 100;
    document.getElementById('progress-bar').style.width = `${pct}%`;

    const box = document.getElementById('options');
    box.innerHTML = '';
    const keys = Object.keys(q.options);
    keys.forEach((key) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt-btn';
      const o = q.options[key];
      btn.innerHTML = `<span class="opt-key">${key}</span>${o.label}`;
      btn.addEventListener('click', () => {
        answers[index] = key;
        index += 1;
        if (index >= total) finish();
        else showQuestion();
      });
      box.appendChild(btn);
    });
  }

  function finish() {
    document.getElementById('screen-quiz').classList.add('hidden');
    document.getElementById('screen-result').classList.remove('hidden');
    showResult(answers);
  }

  showQuestion();
}

function showResult(answers) {
  const { raw, pct } = scoreAnswers(answers);
  const persona = pickPersona(raw);

  const displayName = persona.name.endsWith('米') ? persona.name : `${persona.name}米`;
  document.getElementById('res-name-cn').textContent = displayName;
  document.getElementById('res-code').textContent = persona.code;
  document.getElementById('res-tagline').textContent = persona.tagline;
  const av = document.getElementById('res-avatar');
  av.innerHTML = '';
  if (persona.image) {
    const img = document.createElement('img');
    img.src = persona.image;
    img.alt = displayName;
    img.onerror = () => {
      av.innerHTML = '<span>图片加载失败，请检查 PERSONAS_BY_CODE 中的 image 路径</span>';
    };
    av.appendChild(img);
  } else {
    av.innerHTML = `<span>${persona.code}<br />配图占位</span>`;
  }

  const bars = document.getElementById('dim-bars');
  bars.innerHTML = '';
  DIM_KEYS.forEach((d) => {
    const row = document.createElement('div');
    row.className = 'dim-row';
    const di = DIMENSIONS[d];
    const p = pct[d];
    row.innerHTML = `
      <div class="dim-row-top">
        <span class="dim-label">${di.code}：${p}% 倾向「${di.left}」</span>
        <span class="dim-pct">${p}%</span>
      </div>
      <div class="dim-bar-track"><div class="dim-bar-fill" style="width:${p}%"></div></div>
      <div class="dim-poles"><span>${di.left}</span><span>${di.right}</span></div>
    `;
    bars.appendChild(row);
  });

  const grid = document.getElementById('dim-detail-cards');
  grid.innerHTML = '';
  const detailMap = {
    L: persona.detailL,
    P: persona.detailP,
    M: persona.detailM,
    I: persona.detailI,
  };
  DIM_KEYS.forEach((d) => {
    const di = DIMENSIONS[d];
    const card = document.createElement('div');
    card.className = 'detail-card';
    card.innerHTML = `
      <div class="detail-card-top">
        <span class="detail-card-title">${di.code} ${di.left} / ${di.right}</span>
        <span class="detail-card-score">${pct[d]}%</span>
      </div>
      <div class="detail-card-progress" aria-hidden="true">
        <div class="dim-bar-track"><div class="dim-bar-fill" style="width:${pct[d]}%"></div></div>
      </div>
      <div class="detail-card-body">${detailMap[d]}</div>
    `;
    grid.appendChild(card);
  });
}

document.getElementById('btn-start').addEventListener('click', () => {
  document.getElementById('screen-intro').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');
  renderQuiz();
});

document.getElementById('btn-retry').addEventListener('click', () => {
  document.getElementById('screen-result').classList.add('hidden');
  document.getElementById('screen-quiz').classList.remove('hidden');
  renderQuiz();
});

document.getElementById('btn-close').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back();
});
