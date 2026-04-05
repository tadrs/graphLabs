import { TodoModel } from "../todomodel.js";

export class TodoAPI {
  async getTodos() {
    return await TodoModel.find();
  }

  async getTodoById(id) {
    return await TodoModel.findById(id);
  }

  async createTodo(title, userId) {
    const todo = new TodoModel({ title, userId });
    await todo.save();
    return todo;
  }

  async updateTodo(id, data) {
    return await TodoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteTodo(id) {
    await TodoModel.findByIdAndDelete(id);
    return "Deleted successfully";
  }
}