export class UserStatusStore {
  constructor() {
    if (UserStatusStore.instance) {
      return UserStatusStore.instance;
    }
    this.userStatuses = {};
    UserStatusStore.instance = this;
  }

  static getInstance() {
    if (!UserStatusStore.instance) {
      UserStatusStore.instance = new UserStatusStore();
    }
    return UserStatusStore.instance;
  }

  setUserOnline(userId) {
    this.userStatuses[userId] = true;
  }

  setUserOffline(userId) {
    this.userStatuses[userId] = false;
  }

  isUserOnline(userId) {
    return !!this.userStatuses[userId];
  }
}

UserStatusStore.instance = null;
