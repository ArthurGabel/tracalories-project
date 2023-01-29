// Storage Controller
const StorageCtrl = (function(){
  return {
    getStorage: function(){
      let items;

      if(localStorage.getItem('items') === null) {
        items= [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },
    setItemToStorage: function(item){
      let items;

      if(localStorage.getItem('items') === null) {
        items= [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      items.push(item);

      localStorage.setItem('items', JSON.stringify(items));
    },
    updateStoredItem: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(item.id === updatedItem.id){
          items.splice(index, 1, updatedItem);
        }
      })

      localStorage.setItem('items', JSON.stringify(items));
    },
    updateStoredItemsIds: function(deleteItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item){
        if(item.id > deleteItem.id){
          item.id -= 1;
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteStoredItem: function(deleteItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(item.id === deleteItem.id){
          items.splice(index, 1);
        }
      })

      localStorage.setItem('items', JSON.stringify(items));
    },
    clrStorage: function(){
      localStorage.clear();
    }
  }
})();

// Item Controller
const ItemCtrl = (function() {
  const Item = function(id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  const data = {
    items: StorageCtrl.getStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    logData: function(){
      return data;
    },
    getItems: function(){
      return data.items;
    },
    getEditItem: function(id){
      let editItem = null;

      data.items.forEach(function(item){
        if(item.id === id){
          editItem = item;
        }
      })

      // editItem = data.items[id];

      return editItem;
    },
    addItem: function(name, calories){
      let ID;

      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;    
      } else {
        ID = 0
      }

      const caloriesNum = parseInt(calories);

      newItem = new Item(ID, name, caloriesNum);

      data.items.push(newItem);

      return newItem;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    updateItemData: function(name, calories){
      const caloriesNum = parseInt(calories);

      const currentItem = data.currentItem;
      
      let found = null;

      data.items.forEach(function(item){
        if(item.id === currentItem.id){
          item.name = name;
          item.calories = caloriesNum
          found = item;
        }
      });

      return found;
    },
    updateDataIDs: function(deletedItem){
      data.items.forEach(function(item){
        if(item.id > deletedItem.id){
          item.id -= 1;
        }
      });
    },
    removeItemData: function(deletedItem){
      const items = data.items

      items.forEach(function(item){
        if(item.id === deletedItem.id){
          const index = items.indexOf(item);
          items.splice(index, 1);
        }
      });
    },
    clrAllItems: function(){
      data.items = [];
    },
    getTotalCalories: function(){
      let total = 0;

      data.items.forEach(function(item){
        total += item.calories;
      })

      data.totalCalories = total;

      return data.totalCalories;
    },
    getCurrentItem: function(){
      return data.currentItem;
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clrBtn: '.clear-btn',
    itemNameImput: '#item-name',
    itemCaloriesImput: '#item-calories',
    totalCalories: '.total-calories',
  }

  return {
    getSelectors: function(){
      return UISelectors;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameImput).value,
        calories: document.querySelector(UISelectors.itemCaloriesImput).value
      }
    },
    fillListItems: function(items){
      let html= '';

      items.forEach(function(item){
        html += `<li id="item-${item.id}" class="collection-item">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i> </a>
        </li>`
      })

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    displayNewItem: function(item){
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItems: function(item){
     const listItems = document.querySelectorAll(UISelectors.listItems);

     listItemsArr = Array.from(listItems);

     listItemsArr.forEach(function(li){
      if(li.id === `item-${item.id}`){
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
 
      }
     });
    },
    updateListItemIDs: function(item){
      const listItems = document.querySelectorAll(UISelectors.listItems);

      listItemsArr = Array.from(listItems);

      listItemsArr.forEach(function(li){
        if(li.id > `item-${item.id}`){
          const listId = li.id;
          const listIdArr = listId.split('-');
          const editID = parseInt(listIdArr[1]);

          li.id = `item-${editID - 1}`
        }
      });
    },
    removeFromListItems: function(item){
      const listItems = document.querySelectorAll(UISelectors.listItems);

      listItemsArr = Array.from(listItems);
      
      listItemsArr.forEach(function(li){
        if(li.id === `item-${item.id}`){
          li.remove();
        }
      });
    },
    clrList: function(){
      document.querySelector(UISelectors.itemList).innerHTML = '';
    },
    displayCalories: function(calories){
      document.querySelector(UISelectors.totalCalories).textContent = calories;
    },
    editItemState: function(item){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

      document.querySelector(UISelectors. itemNameImput).value = item.name;
      document.querySelector(UISelectors.itemCaloriesImput).value = item.calories;
    },
    clrEditState: function(){
      UICtrl.clrInputs();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    clrInputs: function(){
      document.querySelector(UISelectors.itemNameImput).value = '';
      document.querySelector(UISelectors.itemCaloriesImput).value = ''
    }
  }
})();

// App Controller
const App = (function(StorageCtrl,ItemCtrl,UICtrl) {
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', addMeal);
    document.querySelector(UISelectors.itemList).addEventListener('click', editItem);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItem);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);
    document.querySelector(UISelectors.backBtn).addEventListener('click', backBtn);
    document.querySelector(UISelectors.clrBtn).addEventListener('click', clrAll);

    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.wich ==13){
        e.preventDefault();
        return false;
      }
    });
  };

  const addMeal = function(e) {
    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      StorageCtrl.setItemToStorage(newItem);

      UICtrl.displayNewItem(newItem);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.displayCalories(totalCalories);
      
      UICtrl.clrInputs();
    } 

    e.preventDefault();
  };

  const editItem = function(e) {
    if(e.target.classList.contains('edit-item')) {
      const listId = e.target.parentElement.parentElement.id;
      const listIdArr = listId.split('-');
      const editItemID = parseInt(listIdArr[1]);

      const editItem = ItemCtrl.getEditItem(editItemID)

      UICtrl.editItemState(editItem);

      ItemCtrl.setCurrentItem(editItem);
    }
    e.preventDefault();
  };

  const updateItem = function(e) {
    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== ''){
      const updatedItemData = ItemCtrl.updateItemData(input.name, input.calories);

      StorageCtrl.updateStoredItem(updatedItemData);

      UICtrl.updateListItems(updatedItemData);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.displayCalories(totalCalories);

      UICtrl.clrEditState();
    }

    e.preventDefault();
  };

  const deleteItem = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.removeItemData(currentItem);
    
    ItemCtrl.updateDataIDs(currentItem);
    
    UICtrl.removeFromListItems(currentItem);

    UICtrl.updateListItemIDs(currentItem);

    StorageCtrl.deleteStoredItem(currentItem);

    StorageCtrl.updateStoredItemsIds(currentItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.displayCalories(totalCalories);

    UICtrl.clrEditState();

    e.preventDefault();
  };

  const backBtn = function(e) {
    UICtrl.clrEditState();

    e.preventDefault();
  };

  const clrAll = function(e) {
    const UISelectors = UICtrl.getSelectors()

    if(document.querySelector(UISelectors.itemList).textContent !== ''){
      if(confirm('Clear all items?')){
        StorageCtrl.clrStorage();

        ItemCtrl.clrAllItems();
        
        UICtrl.clrList();

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.displayCalories(totalCalories);

        UICtrl.clrEditState()
      }
    }

    e.preventDefault();
  }

  return {
    init: function(){
      UICtrl.clrEditState();

      const items = ItemCtrl.getItems();
      UICtrl.fillListItems(items);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.displayCalories(totalCalories);
      
      loadEventListeners();
    }
  };
})(StorageCtrl,ItemCtrl,UICtrl);

App.init();