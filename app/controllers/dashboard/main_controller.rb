module Dashboard
  class MainController < ApplicationController
    before_action :require_login
  end
end
