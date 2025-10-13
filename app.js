// 数据结构：你的实验条目  
// 这里只给出示例名称与简单描述，你可以按实际实验名称替换  
const experiments = [  
  { id: 'exp1', title: '实验 1：光栅化管线初探', description: '实现基本的顶点变换和片元着色，理解光栅化的核心流程。' },  
  { id: 'exp2', title: '实验 2：投影与视口映射', description: '从世界坐标到屏幕坐标的变换链路，掌握投影矩阵的作用。' },  
  { id: 'exp3', title: '实验 3：材质与光源基础', description: '简单光照模型、材质属性对最终渲染效果的影响。' },  
  { id: 'exp4', title: '实验 4：纹理映射入门', description: '纹理坐标、采样与贴图基本概念。' }  
];  

// 页面元素  
const listView = document.getElementById('list-view');  
const detailView = document.getElementById('detail-view');  
const grid = document.getElementById('experimentGrid');  
const backBtn = document.getElementById('backToList');  
const detailContent = document.getElementById('detailContent');  

// 生成实验按钮卡片  
function renderExperimentGrid(items) {  
  grid.innerHTML = '';  
  items.forEach(exp => {  
    const card = document.createElement('div');  
    card.className = 'card';  
    card.style.display = 'flex';  
    card.style.flexDirection = 'column';  
    card.style.justifyContent = 'space-between';  
    card.style.height = '170px';  
    card.innerHTML = `  
      <div>  
        <h3 style="margin:0 0 6px; font-size:1.05rem;">${escapeHtml(exp.title)}</h3>  
        <p style="margin:0; color:#cbd5e1; font-size:0.9rem;">${escapeHtml(exp.description)}</p>  
      </div>  
      <button class="btn" data-action="open" data-id="${exp.id}" style="align-self:flex-end;">进入实验</button>  
    `;  
    grid.appendChild(card);  
  });  
}  

// 安全转义  
function escapeHtml(str) {  
  if (!str) return '';  
  return String(str)  
    .replace(/&/g, '&amp;')  
    .replace(/</g, '&lt;')  
    .replace(/>/g, '&gt;')  
    .replace(/"/g, '&quot;')  
    .replace(/'/g, '&#039;');  
}  

// 进入实验详情  
function showDetail(expId) {  
  const exp = experiments.find(e => e.id === expId);  
  if (!exp) return;  

  detailContent.innerHTML = `  
    <h2 style="margin-top:0; font-size:1.6rem;">${escapeHtml(exp.title)}</h2>  
    <p style="color:#d1d5db; line-height:1.6;">${escapeHtml(exp.description)}</p>  
    <section style="margin-top:12px;">  
      <h3 style="margin:0 0 6px; font-size:1.1rem;">资源与步骤（示例）</h3>  
      <ol style="margin:0; padding-left:20px;">  
        <li>步骤 1：准备工作与环境配置</li>  
        <li>步骤 2：实现核心渲染管线的关键阶段</li>  
        <li>步骤 3：验证渲染结果与调试要点</li>  
      </ol>  
    </section>  
  `
