require "rails_helper"

RSpec.describe CardsController, type: :controller do
  def self.redirects_to_login_path_when_not_authorized(*actions)
    actions.each do |action|
      it "#{action} returns 401 when not authorized" do
        deck = create(:deck)
        card = create(:card, deck_id: deck.id)
        verb = if action == :update
            "PATCH"
          elsif action == :destroy
            "DELETE"
          elsif action == :create
            "POST"
          else
            "GET"
          end

        process action, verb, deck_id: deck.id, id: card.id
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
  end
  redirects_to_login_path_when_not_authorized :index, :show, :new, :edit, :update, :destroy, :create

  describe "user is authorized" do
    before do
      @deck = create(:deck)
      login_user(@deck.user)
    end

    describe "GET #index" do
      it "responds successfully with an HTTP 200 status code" do
        get :index, deck_id: @deck.id
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it "renders the index template" do
        get :index, deck_id: @deck.id
        expect(response).to render_template("index")
      end

      it "loads all of the cards if they exist" do
        card1 = create(:card, deck_id: @deck.id)
        card2 = create(:card, deck_id: @deck.id)
        get :index, deck_id: @deck.id
        expect(assigns(:cards)).to match_array([card1, card2])
      end
    end

    describe "GET #show" do
      before do
        @card = create(:card, deck_id: @deck.id)
      end

      it "responds successfully with an HTTP 200 status code" do
        get :show, deck_id: @deck.id, id: @card.id
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it "renders the show template" do
        get :show, deck_id: @deck.id, id: @card.id
        expect(response).to render_template("show")
      end

      it "loads card if exists" do
        get :show, deck_id: @deck.id, id: @card.id
        expect(assigns(:card)).to eq(@card)
      end

      it "return 404 if card does not exist" do
        get :show, deck_id: @deck.id, id: 0
        expect(response).to have_http_status(404)
        expect(response.body).to eq(I18n.t("activerecord.errors.models.card.not_found"))
      end
    end

    describe "GET #new" do
      it "responds successfully with an HTTP 200 status code" do
        get :new, deck_id: @deck.id
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it "renders the new template" do
        get :new, deck_id: @deck.id
        expect(response).to render_template("new")
      end

      it "creates but doesn`t save new card" do
        get :new, deck_id: @deck.id
        expect(assigns(:card).new_record?).to be true
      end
    end

    describe "POST #create" do
      it "redirects to card's_path" do
        card = attributes_for(:card)
        post :create, deck_id: @deck.id, card: card
        expect(response).to redirect_to(deck_card_path(@deck, assigns(:card)))
      end

      it "changes Cards count" do
        card = attributes_for(:card)
        expect {
          post :create, deck_id: @deck.id, card: card
        }.to change{ Card.count }.by(1)
      end

      it "renders 'new' template if invalid params" do
        text = "ball"
        post :create, deck_id: @deck.id, card: {
          original_text: text,
          translated_text: text
        }
        expect(response).to render_template("new")
      end
    end

    describe "GET #edit" do
      before do
        @card = create(:card, deck_id: @deck.id)
      end

      it "responds successfully with an HTTP 200 status code" do
        get :edit, deck_id: @deck.id, id: @card.id
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it "renders the edit template with @card" do
        get :edit, deck_id: @deck.id, id: @card.id
        expect(response).to render_template("edit")
        expect(assigns(:card)).to eq(@card)
      end
    end

    describe "PATCH/PUT #update" do
      before do
        @card = create(:card, deck_id: @deck.id)
      end

      it "redirects to card's_path" do
        put :update, deck_id: @deck.id, id: @card.id, card: {
          original_text: "qwert",
          translated_text: "qaz"
        }
        expect(response).to redirect_to(deck_card_path(@deck, assigns(:card)))
      end

      it "card with valid params was updated" do
        new_original_text = "qwert"
        new_translated_text = "qaz"
        put :update, deck_id: @deck.id, id: @card.id, card: {
          original_text: new_original_text,
          translated_text: new_translated_text
        }
        @card.reload
        expect(@card.original_text).to eq(new_original_text)
        expect(@card.translated_text).to eq(new_translated_text)
      end

      it "renders 'edit' template if invalid params" do
        new_text = "qwert"
        put :update, deck_id: @deck.id, id: @card.id, card: {
          original_text: new_text,
          translated_text: new_text
        }
        expect(response).to render_template("edit")
      end
    end

    describe "DELETE #destroy" do
      before do
        @card = create(:card, deck_id: @deck.id)
      end

      it "redirects to deck's_path" do
        delete :destroy, deck_id: @deck.id, id: @card.id
        expect(response).to redirect_to(deck_path(@deck))
      end

      it "changes Cards count" do
        expect {
          delete :destroy, deck_id: @deck.id, id: @card.id
        }.to change{ Card.count }.by(-1)
      end

      it "return 404 if card does not exist" do
        delete :destroy, deck_id: @deck.id, id: 0
        expect(response).to have_http_status(404)
        expect(response.body).to eq(I18n.t("activerecord.errors.models.card.not_found"))
      end
    end
  end
end
