'use strict';
document.documentElement.classList.add('js-enabled');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
let motionPaused = false;
function applyMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  $('#motion-toggle').setAttribute('aria-pressed', String(motionPaused));
  $('.motion-label').textContent = motionPaused ? '播放动画' : '暂停动画';
}
applyMotion();
$('#motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}, {threshold: .005, rootMargin: '0px 0px -15px 0px'});
$$('.reveal').forEach(el => revealObserver.observe(el));
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('.reading-progress span').style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
  scrollQueued = false;
}
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, {passive:true});
window.addEventListener('resize', updateScroll); updateScroll();
const navObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    $$('.site-header nav a').forEach(a => { if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
  }
}, {rootMargin:'-10% 0px -65% 0px',threshold:0});
$$('section[id]:not(#top)').forEach(section => navObserver.observe(section));
const milestones = {
 '1911': {suffix:'年',place:'江苏 · 江阴青阳镇',title:'从江南出发，走向广阔世界。',body:'李旭旦出生于江苏江阴。他后来成为人文地理学家、区域地理学家与地理教育家，对人与土地的关系展开长期思考。'},
 '1936': {suffix:'年',place:'英国 · 剑桥大学',title:'远行求学，打开地理的视野。',body:'李旭旦考取中英庚款奖学金，赴英国剑桥大学留学。求学与译介，使他持续接触世界地理学的思想与方法。'},
 '1939': {suffix:'年',place:'中国 · 归国任教',title:'带着所学，回到自己的土地。',body:'留学后，李旭旦于1939年回国，继续投入地理研究与教育。他的研究主张将引进的思想与中国的实际问题相联系。'},
 '1947': {suffix:'年',place:'学术研究 · 综合地理分区',title:'理解一个地方，需要多种目光。',body:'发表《中国地理区之划分》，将地貌、气候、水文、土壤、植被等自然要素，与人口、经济、民族、文化等人文要素结合，提出综合地理分区方案。'},
 '1952': {suffix:'年后',place:'南京 · 南京师范学院',title:'一间课堂，延伸出新的道路。',body:'李旭旦到南京师范学院创建地理系，先后担任系主任、名誉系主任。在研究与教学之间，他让人文地理学的思考有了新的生长之地。'},
 '1985': {suffix:'年',place:'学术留泽 · 继续阅读',title:'书页合上，求索仍在继续。',body:'李旭旦于1985年逝世。同年出版的《人文地理学概说》留下了他的学术思考。后来的研究者通过著作与纪念文章，继续回望他的贡献。'}
};
$$('[data-year]').forEach(button => button.addEventListener('click', () => {
 const item = milestones[button.dataset.year];
 $$('[data-year]').forEach(b => b.setAttribute('aria-pressed', String(b===button)));
 $('#timeline-year').replaceChildren(document.createTextNode(button.dataset.year));
 const suffix=document.createElement('small');suffix.textContent=item.suffix;$('#timeline-year').append(suffix);
 $('#timeline-place').textContent=item.place;$('#timeline-title').textContent=item.title;$('#timeline-description').textContent=item.body;
 const panel=$('.timeline-detail');panel.classList.remove('changing');requestAnimationFrame(()=>panel.classList.add('changing'));
}));
const layers = { nature:true, settlement:false, connection:false };
const observations = {
 river:{layer:'nature',kicker:'自然环境 / 河流',character:'水',title:'一条河，联系着什么？',body:'河流不仅是地图上的线条。水源、交通与沿岸生活，都可能与它相关。打开“聚落分布”和“人的活动”，继续观察。'},
 mountain:{layer:'nature',kicker:'自然环境 / 山地',character:'山',title:'地形，怎样参与日常生活？',body:'坡度、地势与河谷，构成一片土地的自然条件。它们可能影响道路与聚落的位置，但人的选择，还受到技术、历史与文化等因素影响。'},
 village:{layer:'settlement',kicker:'聚落分布 / 居住',character:'居',title:'人们为什么在这里生活？',body:'观察聚落与水源、田地、道路的相对位置。自然条件与生产、交通、历史共同作用，理解聚落需要把这些线索放在一起。'},
 field:{layer:'settlement',kicker:'聚落分布 / 生产',character:'田',title:'田地里，也有人地关系。',body:'土地与水为生产提供条件，人的劳动、技术与组织方式也在改变土地的面貌。环境与人的活动，是相互联系的。'},
 path:{layer:'connection',kicker:'人的活动 / 往来',character:'行',title:'把孤立的点，连成生活。',body:'道路将居住、劳动与交流联系起来。试着同时打开三个图层：一片土地的故事，就在自然环境与人的活动之间展开。'}
};
let selectedNode='river';
function selectNode(key) {
 selectedNode=key;
 $$('[data-node]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.node===key)));
 const d=observations[key];
 if(d){$('#insight-kicker').textContent=d.kicker;$('#insight-character').textContent=d.character;$('#insight-title').textContent=d.title;$('#insight-body').textContent=d.body;}
 else {$('#insight-kicker').textContent='观地 / 选择图层';$('#insight-character').textContent='观';$('#insight-title').textContent='从一个图层，重新开始。';$('#insight-body').textContent='打开上方任意图层，再点选画中的标记。山水意象始终保留，标记与连线会随你的选择展开。';}
}
function renderLayers() {
 $$('[data-layer]').forEach(b=> { const on=layers[b.dataset.layer];b.setAttribute('aria-pressed',String(on));$('.toggle-mark',b).textContent=on?'✓':'＋'; });
 $$('[data-for-layer]').forEach(el=>{el.toggleAttribute('hidden',!layers[el.dataset.forLayer]);});
 $('#layer-count').textContent=`已展开 ${Object.values(layers).filter(Boolean).length} / 3 个图层`;
 if(!selectedNode || !layers[observations[selectedNode].layer]) {
  const next=Object.keys(observations).find(k=>layers[observations[k].layer]);selectNode(next||null);
 }
}
$$('[data-layer]').forEach(button=>button.addEventListener('click',()=>{layers[button.dataset.layer]=!layers[button.dataset.layer];renderLayers();}));
$$('[data-node]').forEach(button=>button.addEventListener('click',()=>selectNode(button.dataset.node)));
$('#map-reset').addEventListener('click',()=>{layers.nature=true;layers.settlement=false;layers.connection=false;selectNode('river');renderLayers();});
renderLayers();
$$('[data-open-dialog]').forEach(button=>button.addEventListener('click',()=>{document.getElementById(button.dataset.openDialog).showModal();document.body.classList.add('dialog-open');}));
$$('dialog').forEach(dialog=>{
 $('.dialog-close',dialog).addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
});
// Optional browser agent interface shares the exact state used by the map controls.
if (document.modelContext?.registerTool) {
 const lifecycle = new AbortController();
 const registerMapTool = () => document.modelContext.registerTool({
  name:'configure_geography_layers',title:'选择人地关系地图图层',
  description:'设置本展览的概念地图图层，可同时选择一个可见标记。仅改变当前页面的展示状态。',
  inputSchema:{type:'object',properties:{visibleLayers:{type:'array',items:{type:'string',enum:['nature','settlement','connection']},uniqueItems:true},selectedNode:{type:'string',enum:['river','mountain','village','field','path']}},required:['visibleLayers'],additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},
  execute(input){
   if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['visibleLayers','selectedNode'].includes(k))||!Array.isArray(input.visibleLayers)||input.visibleLayers.some(k=>!Object.hasOwn(layers,k))||new Set(input.visibleLayers).size!==input.visibleLayers.length) throw new Error('visibleLayers 必须是不重复的合法图层数组。');
   if(input.selectedNode!==undefined&&(!Object.hasOwn(observations,input.selectedNode)||!input.visibleLayers.includes(observations[input.selectedNode].layer))) throw new Error('selectedNode 必须属于所选图层。');
   Object.keys(layers).forEach(k=>{layers[k]=input.visibleLayers.includes(k);});renderLayers();
   if(input.selectedNode)selectNode(input.selectedNode);
   return {visibleLayers:Object.keys(layers).filter(k=>layers[k]),selectedNode,heading:$('#insight-title').textContent};
  }
 },{signal:lifecycle.signal});
 try{Promise.resolve(registerMapTool()).catch(()=>{});}catch{}
 window.addEventListener('pagehide',e=>{if(!e.persisted)lifecycle.abort();},{once:true});
}
