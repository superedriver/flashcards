module Dashboard
  class DecksController < MainController
    before_action :find_deck, only: [:show, :edit, :update, :destroy, :activate, :deactivate]

    # GET /decks
    def index
      @decks = current_user.decks
    end

    # GET /decks/new
    def new
      @deck = Deck.new
    end

    # POST /decks
    def create
      @deck = current_user.decks.new(deck_params)
      if @deck.save
        redirect_to deck_path(@deck),
                    flash: { success: I18n.t('flashes.decks.success.created') }
      else
        render "new"
      end
    end

    # GET /decks/:id
    def show
    end

    # GET /decks/:id/edit
    def edit
    end

    # PATCH/PUT  /decks/:id
    def update
      if @deck.update(deck_params)
        redirect_to decks_path,
                    flash: { success: I18n.t('flashes.decks.success.updated') }
      else
        render "edit"
      end
    end

    # DELETE /decks/:id
    def destroy
      @deck.destroy
      redirect_to decks_path,
                  flash: { success: I18n.t('flashes.decks.success.deleted') }
    end

    # GET /decks/:id/activate
    def activate
      @deck.set_current!
      redirect_to decks_path,
                  flash: { success: I18n.t('flashes.decks.success.activated') }
    end

    # GET /decks/:id/deactivate
    def deactivate
      @deck.set_not_current!
      redirect_to decks_path,
                  flash: { success: I18n.t('flashes.decks.success.deactivated') }
    end

    private
      def deck_params
        params.require(:deck).permit(:name, :user_id)
      end

      def find_deck
        @deck = current_user.decks.find_by(id: params[:id])
        unless @deck
          render text: I18n.t("activerecord.errors.models.deck.not_found"), status: 404
        end
      end
  end
end
