class TasksController < ApplicationController
    after_action :set_session
 
    def create
        @task = Task.new(task_params)

        if @task.save
            flash[:success] = 'Task created successfully!'
        else
            flash[:error] = 'Failed to create task.'
        end
        
        redirect_to root_path
    end
  
    def destroy
        @task = Task.find(params[:id])
        
        if @task.destroy
            flash[:success] = 'Task deleted successfully!'
        else
            flash[:error] = 'Failed to delete task.'
        end
        
        redirect_to root_path
    end

    def update
        @task = Task.find(params[:id])
        
        if @task.update(task_params)
            flash[:success] = 'Task updated successfully!'
        else
            flash[:error] = 'Failed to update task.'
        end

        redirect_to root_path
    end
    
    private

    def task_params
        params.require(:task).permit(:title, :note, :completed, :list_id)
    end

    def set_session
        session[:reload_root] = true
        session[:flash_message] = flash.to_hash
    end
end
