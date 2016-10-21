module Dashboard
  class SessionsController < MainController
    def destroy
      logout
      redirect_to root_path
    end
  end
end
