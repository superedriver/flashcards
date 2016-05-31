class TrainingController < ApplicationController
  before_action :find_card, only: [:check]
  def check
    result = CheckTranslation.new(@card).check_translation?(params[:card][:original_text])
    if result.success?
      flash[:success] = result.message
    else
      flash[:error]  = result.message
    end
    redirect_to root_path
  end
end
