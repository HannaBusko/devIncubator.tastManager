var context;

let taskService = new TaskService();
let uiProccessor = new TaskUIProcessor();
let eventHandler = new EventHandler(taskService, uiProccessor);

context = { eventHandler };

uiProccessor.applyTheme();
taskService.readFromStorage();
eventHandler.updateUI();

