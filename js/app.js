(() => {
  const root = document.documentElement;
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const themeToggle = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem('safari-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const syncThemeIcon = () => { themeToggle.textContent = root.dataset.theme === 'light' ? '☾' : '☼'; };
  syncThemeIcon();

  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('safari-theme', root.dataset.theme);
    syncThemeIcon();
  });

  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  const destinations = {
    mara: {
      kicker: 'Iconic safari country',
      title: 'Masai Mara National Reserve',
      text: 'Classic East African savannah with exceptional concentrations of wildlife and a strong reputation for big-cat sightings. Early mornings and long game-drive days are the heart of the experience.',
      image: 'assets/hero-migration.webp',
      alt: 'Masai Mara savannah filled with wildlife',
      tags: ['lion', 'leopard', 'cheetah', 'migration landscape']
    },
    nakuru: {
      kicker: 'Rift Valley contrast',
      title: 'Lake Nakuru National Park',
      text: 'A compact wildlife stop that changes the visual rhythm of the trip: lake scenery, wooded sections and escarpment views between the wide-open savannah regions.',
      image: 'assets/nakuru-cliff.webp',
      alt: 'Scenic lodge setting near Lake Nakuru',
      tags: ['Rift Valley', 'lake scenery', 'wildlife', 'scenic stay']
    },
    naivasha: {
      kicker: 'A slower interlude',
      title: 'Lake Naivasha',
      text: 'A calmer lake environment that works well as a breathing space between intensive game-drive destinations. It is a place to slow the tempo and enjoy the lodge as much as the route.',
      image: 'assets/naivasha.webp',
      alt: 'Wildlife and landscape near Lake Naivasha',
      tags: ['lake', 'relaxed pace', 'lodge time', 'Rift Valley']
    },
    amboseli: {
      kicker: 'Elephants and horizons',
      title: 'Amboseli National Park',
      text: 'Open country known for elephants and, when conditions cooperate, the dramatic presence of Mount Kilimanjaro on the horizon. It gives the final days a very different visual identity.',
      image: 'assets/amboseli.webp',
      alt: 'Elephants with Mount Kilimanjaro behind them',
      tags: ['elephants', 'Kilimanjaro', 'open plains', 'photography']
    }
  };

  const panel = {
    image: document.getElementById('destinationImage'),
    kicker: document.getElementById('destinationKicker'),
    title: document.getElementById('destinationTitle'),
    text: document.getElementById('destinationText'),
    tags: document.getElementById('destinationTags')
  };
  document.querySelectorAll('.destination-tab').forEach(button => {
    button.addEventListener('click', () => {
      const item = destinations[button.dataset.destination];
      if (!item) return;
      document.querySelectorAll('.destination-tab').forEach(b => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-selected', b === button ? 'true' : 'false');
      });
      panel.image.src = item.image;
      panel.image.alt = item.alt;
      panel.kicker.textContent = item.kicker;
      panel.title.textContent = item.title;
      panel.text.textContent = item.text;
      panel.tags.innerHTML = item.tags.map(tag => `<span>${tag}</span>`).join('');
    });
  });

  const styleTitle = document.getElementById('styleTitle');
  const styleText = document.getElementById('styleText');
  const styleList = document.getElementById('styleList');
  const preferenceInputs = [...document.querySelectorAll('input[name="pref"]')];
  const updateStyle = () => {
    const selected = new Set(preferenceInputs.filter(i => i.checked).map(i => i.value));
    let title = 'Classic Kenya discovery';
    let text = 'A multi-region safari combining the Masai Mara, the Rift Valley lakes and Amboseli. Strong wildlife time with enough contrast to make each stop feel different.';
    let list = ['2 nights Mara','1 night Nakuru','1 night Naivasha','2 nights Amboseli'];

    if (selected.has('privacy') && selected.has('pace')) {
      title = 'Conservancy-style retreat';
      text = 'Base the trip around fewer places, a smaller camp atmosphere and more time to settle into the rhythm of one wildlife area instead of moving every day.';
      list = ['3–4 nights Mara region','fewer transfers','camp time','optional fly-in'];
    } else if (selected.has('wildlife') && !selected.has('landscape')) {
      title = 'Wildlife-first Mara immersion';
      text = 'Spend more of the trip in the Mara region, reducing transfers so the best hours of the day are available for game drives and tracking.';
      list = ['Mara focus','early drives','full-day option','minimal transfers'];
    } else if (selected.has('special') && selected.has('privacy')) {
      title = 'Celebration safari';
      text = 'Use a smaller number of premium-feeling stops and deliberately build in one or two standout moments rather than packing every day with activities.';
      list = ['intimate camp','balloon morning','private moments','slower pacing'];
    } else if (selected.has('pace') && selected.has('landscape')) {
      title = 'Slow scenic circuit';
      text = 'Keep the visual variety of the classic circuit but allow longer stays and a less compressed transfer schedule, especially around Naivasha and Amboseli.';
      list = ['Mara','Naivasha pause','Amboseli','longer stays'];
    }
    styleTitle.textContent = title;
    styleText.textContent = text;
    styleList.innerHTML = list.map(v => `<span>${v}</span>`).join('');
  };
  preferenceInputs.forEach(i => i.addEventListener('change', updateStyle));
  updateStyle();

})();
