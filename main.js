/* ============================================
   rs-docs 统一文档站 - PJAX + marked + highlight.js
   侧边栏折叠式项目导航
   ============================================ */

(() => {

  const contentEl = document.getElementById('content');
  const loadingBar = document.getElementById('loading-bar');
  const sidebar = document.getElementById('sidebar');

  const projects = {
    rslog: {
      name: 'rslog',
      title: 'rslog - 日志库',
      accent: '#de6a2b',
      icon: '📋',
      sections: [
        { title: '入门', links: [
          { label: '首页', md: '1-INDEX.md' },
          { label: '快速开始', md: '2-README.md' },
          { label: 'API 指南', md: '3-API_GUIDE.md' }
        ]},
        { title: '资源', links: [
          { label: 'GitHub 仓库', href: 'https://github.com/Cnkrru/rslog', external: true },
          { label: 'crates.io', href: 'https://crates.io/crates/rslog', external: true },
          { label: 'docs.rs', href: 'https://docs.rs/rslog', external: true }
        ]}
      ]
    },
    rscsv: {
      name: 'rscsv',
      title: 'rscsv - CSV 库',
      accent: '#4a90d9',
      icon: '📊',
      sections: [
        { title: '入门', links: [
          { label: '首页', md: '1-INDEX.md' },
          { label: '快速开始', md: '2-README.md' },
          { label: 'API 指南', md: '3-API_GUIDE.md' }
        ]},
        { title: '资源', links: [
          { label: 'GitHub 仓库', href: 'https://github.com/Cnkrru/rust-package', external: true }
        ]}
      ]
    },
    rstime: {
      name: 'rstime',
      title: 'rstime - 时间库',
      accent: '#8e44ad',
      icon: '🕐',
      sections: [
        { title: '入门', links: [
          { label: '首页', md: '1-INDEX.md' },
          { label: '快速开始', md: '2-README.md' },
          { label: 'API 指南', md: '3-API_GUIDE.md' }
        ]},
        { title: '资源', links: [
          { label: 'GitHub 仓库', href: 'https://github.com/Cnkrru/rust-package', external: true }
        ]}
      ]
    }
  };

  let currentProject = null;
  let currentMd = null;

  marked.setOptions({ highlight: false, gfm: true, breaks: false, langPrefix: 'language-' });
  hljs.configure({ ignoreUnescapedHTML: true });

  function buildSidebar() {
    let html = '';
    const projectKeys = Object.keys(projects);

    projectKeys.forEach(key => {
      const p = projects[key];
      html += '<div class="sidebar-project" data-project="' + p.name + '">';
      html += '<div class="sidebar-project-header" data-project="' + p.name + '">';
      html += '<span class="arrow">&#9654;</span>';
      html += '<span class="project-icon">' + p.icon + '</span>';
      html += '<span class="project-name">' + p.name + '</span>';
      html += '<span class="project-dot ' + p.name + '"></span>';
      html += '</div>';
      html += '<div class="sidebar-project-links">';
      p.sections.forEach(section => {
        html += '<div class="sidebar-section-title">' + section.title + '</div>';
        section.links.forEach(link => {
          if (link.external) {
            html += '<a href="' + link.href + '" class="sidebar-link" target="_blank" data-project="' + p.name + '">' + link.label + '</a>';
          } else {
            html += '<a href="#" class="sidebar-link" data-md="' + link.md + '" data-project="' + p.name + '">' + link.label + '</a>';
          }
        });
      });
      html += '</div></div>';
    });

    sidebar.innerHTML = html;

    sidebar.querySelectorAll('.sidebar-project-header').forEach(header => {
      header.addEventListener('click', function() {
        const projectName = this.getAttribute('data-project');
        collapseAllExcept(projectName);
      });
    });

    sidebar.querySelectorAll('.sidebar-link[data-md]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const projectName = this.getAttribute('data-project');
        const md = this.getAttribute('data-md');
        switchTo(projectName, md);
      });
    });
  }

  function collapseAllExcept(projectName) {
    sidebar.querySelectorAll('.sidebar-project-header').forEach(header => {
      const name = header.getAttribute('data-project');
      if (name === projectName) {
        header.classList.toggle('expanded');
      } else {
        header.classList.remove('expanded');
      }
    });
  }

  function expandOnly(projectName) {
    sidebar.querySelectorAll('.sidebar-project-header').forEach(header => {
      const name = header.getAttribute('data-project');
      if (name === projectName) {
        header.classList.add('expanded');
      }
    });
  }

  function switchTo(projectName, mdFile) {
    if (!projects[projectName]) return;
    currentProject = projects[projectName];
    currentMd = null;
    expandOnly(projectName);
    updateAccent();
    loadPage(mdFile);
  }

  function updateAccent() {
    if (!currentProject) return;
    const accent = currentProject.accent;
    const style = document.createElement('style');
    style.id = 'accent-dynamic';
    const old = document.getElementById('accent-dynamic');
    if (old) old.remove();
    style.textContent = [
      '.sidebar-link[data-project="' + currentProject.name + '"].active { border-left-color: ' + accent + '; }'
    ].join('\n');
    document.head.appendChild(style);
    loadingBar.style.background = accent;
    document.title = currentProject.title + ' - rs-docs';
  }

  function loadPage(mdFile) {
    if (!currentProject) return;
    if (mdFile === currentMd) return;
    currentMd = mdFile;

    loadingBar.style.opacity = '1';
    loadingBar.style.width = '30%';

    const url = currentProject.name + '/' + mdFile;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 0) {
        const html = marked.parse(xhr.responseText);
        contentEl.innerHTML = html;

        contentEl.querySelectorAll('pre code').forEach(block => {
          hljs.highlightElement(block);
        });

        contentEl.querySelectorAll('p code, li code, td code').forEach(el => {
          el.style.background = '#e8e8ee';
          el.style.color = '#c7254e';
        });

        addCopyButtons();
        updateSidebarActive();

        const titleEl = contentEl.querySelector('h1');
        document.title = (titleEl ? titleEl.textContent + ' - ' : '') + currentProject.title + ' - rs-docs';

        loadingBar.style.width = '100%';
        setTimeout(() => {
          loadingBar.style.opacity = '0';
          loadingBar.style.width = '0';
        }, 300);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        history.replaceState(
          { project: currentProject.name, md: mdFile },
          '',
          '#' + currentProject.name + '/' + mdFile
        );

        if (window.innerWidth <= 768) {
          sidebar.classList.remove('open');
          document.getElementById('sidebar-overlay').classList.remove('active');
        }
      }
    };

    xhr.onerror = () => {
      contentEl.innerHTML = '<h1>加载失败</h1><p>无法加载文档内容，请检查网络连接后刷新页面。</p>';
      loadingBar.style.opacity = '0';
      loadingBar.style.width = '0';
    };

    xhr.send();
  }

  function updateSidebarActive() {
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-md') === currentMd &&
          link.getAttribute('data-project') === currentProject.name) {
        link.classList.add('active');
      }
    });
  }

  function addCopyButtons() {
    contentEl.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      pre.appendChild(btn);
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const code = pre.querySelector('code');
        const text = code ? (code.textContent || '') : '';
        const doCopy = navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(text)
          : new Promise(resolve => {
              const ta = document.createElement('textarea');
              ta.value = text;
              ta.style.opacity = '0';
              ta.style.position = 'fixed';
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
              resolve();
            });
        doCopy.then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        }).catch(() => {});
      });
    });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (menuToggle && sidebar && overlay) {
    const toggleMenu = () => { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); };
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }

  window.addEventListener('popstate', e => {
    if (e.state && e.state.project && e.state.md) {
      currentProject = null;
      currentMd = null;
      switchTo(e.state.project, e.state.md);
    } else {
      initFromHash();
    }
  });

  function initFromHash() {
    const hash = location.hash.replace('#', '');
    let projectName = 'rslog';
    let mdFile = null;

    if (hash) {
      const parts = hash.split('/');
      if (parts.length >= 2 && projects[parts[0]]) {
        projectName = parts[0];
        mdFile = parts.slice(1).join('/');
      } else if (projects[hash]) {
        projectName = hash;
      }
    }

    if (!mdFile) {
      mdFile = projects[projectName].sections[0].links[0].md;
    }

    currentProject = projects[projectName];
    currentMd = null;
    buildSidebar();
    expandOnly(projectName);
    updateAccent();
    loadPage(mdFile);
  }

  initFromHash();

})();