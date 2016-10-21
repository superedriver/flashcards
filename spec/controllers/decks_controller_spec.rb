require 'rails_helper'

RSpec.describe Dashboard::DecksController, type: :controller do

  def self.redirects_to_login_path_when_not_authorized(*actions)
    actions.each do |action|
      it "#{action} returns 401 when not authorized" do
        deck = create(:deck)
        verb = if action == :update
                 'PATCH'
               elsif action == :destroy
                 'DELETE'
               elsif action == :create
                 'POST'
               else
                 'GET'
               end

        process action, verb, id: deck.id
        expect(response).to have_http_status(302)
        expect(response).to redirect_to(login_path)
      end
    end
  end
  redirects_to_login_path_when_not_authorized(
      :index,
      :show,
      :new,
      :edit,
      :update,
      :destroy,
      :create,
      :activate,
      :deactivate
  )

  describe 'user is authorized' do
    before do
      @user = create(:user)
      login_user(@user)
    end

    describe 'GET #index' do
      it 'responds successfully with an HTTP 200 status code' do
        get :index
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it 'renders the index template' do
        get :index
        expect(response).to render_template('index')
      end

      it 'loads all of the decs if they exist' do
        deck1 = create(:deck, user_id: @user.id)
        deck2 = create(:deck, user_id: @user.id)
        get :index
        expect(assigns(:decks)).to match_array([deck1, deck2])
      end
    end

    describe 'GET #show' do
      before do
        @deck = create(:deck, user_id: @user.id)
      end

      it 'responds successfully with an HTTP 200 status code' do
        get :show, params: { id: @deck.id }
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it 'renders the show template' do
        get :show, params: { id: @deck.id }
        expect(response).to render_template('show')
      end

      it 'loads deck if exists' do
        get :show, params: { id: @deck.id }
        expect(assigns(:deck)).to eq(@deck)
      end

      it 'return 404 if card does not exist' do
        get :show, params: { id: 0 }
        expect(response).to have_http_status(404)
        expect(response.body).to eq(I18n.t('activerecord.errors.models.deck.not_found'))
      end
    end

    describe 'GET #new' do
      it 'responds successfully with an HTTP 200 status code' do
        get :new
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it 'renders the new template' do
        get :new
        expect(response).to render_template('new')
      end

      it 'creates but doesn`t save new deck' do
        get :new
        expect(assigns(:deck).new_record?).to be true
      end
    end

    describe 'POST #create' do
      it 'redirects to card\'s_path' do
        post :create, params: { deck: {
            name: 'ball'
          }
        }
        expect(response).to redirect_to(deck_path(assigns(:deck)))
      end

      it 'changes Decs count' do
        expect {
          post :create, params: { deck: {
              name: 'ball'
            }
          }
        }.to change{Deck.count}.by(1)
      end
    end

    describe 'GET #edit' do
      before do
        @deck = create(:deck, user_id: @user.id)
      end

      it 'responds successfully with an HTTP 200 status code' do
        get :edit, params: { id: @deck.id }
        expect(response).to be_success
        expect(response).to have_http_status(200)
      end

      it 'renders the edit template with @deck' do
        get :edit, params: { id: @deck.id }
        expect(response).to render_template('edit')
        expect(assigns(:deck)).to eq(@deck)
      end
    end

    describe 'PATCH/PUT #update' do
      before do
        @deck = create(:deck, user_id: @user.id)
      end

      it 'redirects to deck\'s_path' do
        put :update, params: { id: @deck.id, deck: {
            name: 'name1'
          }
        }
        expect(response).to redirect_to(decks_path)
      end

      it 'deck was updated' do
        new_name = 'new name'
        put :update, params: { id: @deck.id,
          deck: {  name: new_name }
        }
        @deck.reload
        expect(@deck.name).to eq(new_name)
      end
    end

    describe 'DELETE #destroy' do
      before do
        @deck = create(:deck, user_id: @user.id)
      end

      it 'redirects to deck\'s_path' do
        delete :destroy, params: { id: @deck.id }
        expect(response).to redirect_to(decks_path)
      end

      it 'changes Decs count' do
        expect {
          delete :destroy, params: { id: @deck.id }
        }.to change{Deck.count}.by(-1)
      end

      it 'return 404 if card does not exist' do
        delete :destroy, params: { id: 0 }
        expect(response).to have_http_status(404)
        expect(response.body).to eq(I18n.t('activerecord.errors.models.deck.not_found'))
      end
    end

    describe 'GET #activate' do
      before do
        @deck1 = create(:deck, user_id: @user.id)
        @deck2 = create(:deck, user_id: @user.id)
      end

      it 'activates deck' do
        get :activate, params: { id: @deck1.id }
        expect(assigns(:deck).current).to eq true
      end

      it 'deactivates another decks' do
        @deck2.update_column(:current, true)
        get :activate, params: { id: @deck1.id }
        @deck2.reload
        expect(@deck2.current).to eq false
      end

      it 'redirects to decks_path' do
        get :activate, params: { id: @deck1.id }
        expect(response).to redirect_to(decks_path)
      end
    end

    describe 'GET #deactivate' do
      before do
        @deck = create(:deck, user_id: @user.id)
        @deck.update_column(:current, true)
      end

      it 'deactivates deck' do
        get :deactivate, params: { id: @deck.id }
        @deck.reload
        expect(@deck.current).to eq false
      end

      it 'redirects to decks_path' do
        get :deactivate, params: { id: @deck.id }
        expect(response).to redirect_to(decks_path)
      end
    end
  end
end
