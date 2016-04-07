module DecksHelper
  def get_active_button(deck)
    deck.current ? I18n.t("buttons.deactivate") : I18n.t("buttons.activate")
  end

  def get_active_class(deck)
    deck.current ? "btn btn-warning btn-sm" : "btn btn-caccess btn-sm"
  end
end
