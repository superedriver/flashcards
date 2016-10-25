module Dashboard
  class TrainingController < MainController
    before_action :find_card, only: [:check]
    def check
      result = SuperMemo2.new(@card, params[:quality_response]).check_translation(params[:card][:original_text])
      if result.success?
        flash[:success] = result.message
      else
        flash[:error]  = result.message
      end

      respond_to do |format|
        format.html { redirect_to root_path }
        format.js
      end
    end
  end
end

