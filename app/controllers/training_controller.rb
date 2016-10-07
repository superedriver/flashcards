class TrainingController < ApplicationController
  before_action :find_card, only: [:check]
  def check

    result = SuperMemo2.new(@card, params[:quality_response]).check_translation(params[:card][:original_text])
    if result.success?
      flash[:success] = result.message
    else
      flash[:error]  = result.message
    end
    # binding.pry
    respond_to do |format|
      format.html { redirect_to root_path }
      format.js

      # if @user.save
      #   format.html { redirect_to @user, notice: 'User was successfully created.' }
      #   format.js   {}
      #   format.json { render json: @user, status: :created, location: @user }
      # else
      #   format.html { render action: "new" }
      #   format.json { render json: @user.errors, status: :unprocessable_entity }
      # end
    end
    # redirect_to root_path
  end
end
