from base_player import BasePlayer
class Benefactor(BasePlayer):
  def __init__(self, **kwargs):
    super(Benefactor, self).__init__(kwargs)
    self.gold *= 5
    self.inventory.extend(['matches', 'map to xanadu', 'revolver',
      'ancient mongolian translation book'])
    self.can_translate_modern = True
