/* add your code here */

document.addEventListener('DOMContentLoaded', () => {
    const userSidebar = document.querySelector('.user-list');
    const stockSection = document.querySelector('.portfolio-list');
    const stockDetail = document.querySelector('.stock-form');
    const saveBtn = document.querySelector('#btnSave');
    const deleteBtn = document.querySelector('#btnDelete');
  
    const State = {
      users: JSON.parse(userContent),
      stocks: JSON.parse(stockContent),
      activeUser: null
    };
  
    renderUserSidebar();
    initEvents();
  
    /** Initialize core event listeners */
    function initEvents() {
      userSidebar.addEventListener('click', (e) => {
        const selectedId = parseInt(e.target.id);
        const selected = State.users.find(u => u.id === selectedId);
        if (selected) {
          State.activeUser = selected;
          loadUserIntoForm(selected);
          displayUserPortfolio(selected);
        }
      });
  
      stockSection.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const symbol = e.target.dataset.symbol;
          showStockDetails(symbol);
        }
      });
  
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (State.activeUser) updateUserInfo();
      });
  
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (State.activeUser) {
          State.users = State.users.filter(u => u.id !== State.activeUser.id);
          State.activeUser = null;
          resetForm();
          renderUserSidebar();
          stockSection.innerHTML = '';
          stockDetail.style.display = 'none';
        }
      });
    }
  
    /** Render the sidebar list of users */
    function renderUserSidebar() {
      userSidebar.innerHTML = '';
      for (const { user, id } of State.users) {
        const li = document.createElement('li');
        li.textContent = `${user.lastname}, ${user.firstname}`;
        li.id = id;
        userSidebar.appendChild(li);
      }
    }
  
    /** Fill the user info into the form */
    function loadUserIntoForm(userObj) {
      const { user, id } = userObj;
      document.querySelector('#userID').value = id;
      document.querySelector('#firstname').value = user.firstname;
      document.querySelector('#lastname').value = user.lastname;
      document.querySelector('#address').value = user.address;
      document.querySelector('#city').value = user.city;
      document.querySelector('#email').value = user.email;
    }
  
    /** Clear all form fields */
    function resetForm() {
      for (const field of ['#userID', '#firstname', '#lastname', '#address', '#city', '#email']) {
        document.querySelector(field).value = '';
      }
    }
  
    /** Render the portfolio for the selected user */
    function displayUserPortfolio(userObj) {
      stockSection.innerHTML = '';
      for (const { symbol, owned } of userObj.portfolio) {
        const container = document.createElement('div');
        container.classList.add('holding-entry');
  
        const stockInfo = document.createElement('p');
        stockInfo.textContent = `Stock: ${symbol} | Shares: ${owned}`;
  
        const btn = document.createElement('button');
        btn.textContent = 'Details';
        btn.dataset.symbol = symbol;
  
        container.appendChild(stockInfo);
        container.appendChild(btn);
        stockSection.appendChild(container);
      }
    }
  
    /** Show details of a stock when 'Details' button is clicked */
    function showStockDetails(symbol) {
      const stock = State.stocks.find(s => s.symbol === symbol);
      if (stock) {
        stockDetail.style.display = 'block';
        document.querySelector('#stockName').textContent = stock.name;
        document.querySelector('#stockSector').textContent = stock.sector;
        document.querySelector('#stockIndustry').textContent = stock.subIndustry;
        document.querySelector('#stockAddress').textContent = stock.address;
        document.querySelector('#logo').src = `logos/${symbol}.svg`;
      }
    }
  
    /** Update user object from form */
    function updateUserInfo() {
      const id = parseInt(document.querySelector('#userID').value);
      const updatedUser = State.users.find(u => u.id === id);
  
      if (updatedUser) {
        updatedUser.user.firstname = document.querySelector('#firstname').value;
        updatedUser.user.lastname = document.querySelector('#lastname').value;
        updatedUser.user.address = document.querySelector('#address').value;
        updatedUser.user.city = document.querySelector('#city').value;
        updatedUser.user.email = document.querySelector('#email').value;
  
        renderUserSidebar(); // refresh sidebar to reflect updates
      }
    }
  });
  