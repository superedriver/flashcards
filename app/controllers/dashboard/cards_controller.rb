module Dashboard
  class CardsController < MainController
    before_action :find_deck, only: [:index, :new, :create, :edit, :destroy]
    before_action :find_card, only: [:show, :edit, :update, :destroy]

    # GET /decks/:deck_id/cards
    def index
      @cards = @deck.cards
    end

    # GET /decks/:deck_id/cards/:id
    def show
    end

    # GET /decks/:deck_id/cards/new
    def new
      @card = Card.new
    end

    # POST /decks/:deck_id/cards
    def create
      @card = @deck.cards.new(card_params)
      if @card.save
        redirect_to deck_card_path(@card.deck, @card),
          flash: { success: t('flashes.cards.success.created') }
      else
        render 'new'
      end
    end

    # GET /decks/:deck_id/cards/:id/edit
    def edit
    end

    # PATCH /decks/:deck_id/cards/:id/edit
    # PUT /decks/:deck_id/cards/:id/edit
    def update
      if @card.update(card_params)
        redirect_to deck_card_path(@card.deck, @card),  flash: { success: t('flashes.cards.success.updated') }
      else
        render 'edit'
      end
    end

    # DELETE /decks/:deck_id/cards/:id
    def destroy
      @card.destroy
      redirect_to deck_path(@deck), flash: { success: t('flashes.cards.success.deleted') }
    end

    private
      def card_params
        params.require(:card).permit(
          :original_text,
          :translated_text,
          :review_date,
          :deck_id,
          :image,
          :current_step,
          :remove_image,
          :attempts_count
        )
      end

      def find_deck
        @deck = Deck.find_by(id: params['deck_id'])
        unless @deck
          render text: t('activerecord.errors.models.deck.not_found'), status: 404
        end
      end
  end
end
