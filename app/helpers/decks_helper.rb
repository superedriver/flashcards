module DecksHelper
  def get_active_button(deck)
    deck.current ? I18n.t("buttons.deactivate") : I18n.t("buttons.activate")
  end

  def get_active_class(deck)
    deck.current ? "btn btn-warning btn-sm" : "btn btn-success btn-sm"
  end

  def get_active_url(deck)
    deck.current ? deactivate_deck_path(deck) : activate_deck_path(deck)
  end
end
