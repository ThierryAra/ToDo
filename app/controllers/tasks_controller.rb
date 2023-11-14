class TasksController < ApplicationController
    def new
        @task = Task.new
    end

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

        redirect_back(fallback_location: root_path)
    end

    def update
        @task = Task.find(params[:id])
        if @task.update(task_params)
            flash[:success] = 'Task updated successfully!'
            else
                flash[:error] = 'Failed to update task.'
        end

        redirect_back(fallback_location: root_path)
    end
    
    private

    def task_params
        params.require(:task).permit(:title, :note, :completed, :list_id)
    end
end
