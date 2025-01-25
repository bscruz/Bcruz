import pygame
import random
import math

# Initialize pygame
pygame.init()

# Set up the display
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Neko Follows Mouse")

# Define sprite sets (similar to JS sprite sets)
sprite_sets = {
    'idle': [(-3, -3)],
    'alert': [(-7, -3)],
    'scratch': [(-5, 0), (-6, 0), (-7, 0)],
    'tired': [(-3, -2)],
    'sleeping': [(-2, 0), (-2, -1)],
    'N': [(-1, -2), (-1, -3)],
    'NE': [(0, -2), (0, -3)],
    'E': [(-3, 0), (-3, -1)],
    'SE': [(-5, -1), (-5, -2)],
    'S': [(-6, -3), (-7, -2)],
    'SW': [(-5, -3), (-6, -1)],
    'W': [(-4, -2), (-4, -3)],
    'NW': [(-1, 0), (-1, -1)],
}

# Random integer function (mimics JavaScript's randomInt function)
def randomInt(min_val, max_val):
    return random.randint(min_val, max_val)

# Neko class (equivalent to ONekoElement in JS)
class Neko:
    def __init__(self):
        self.x = 32
        self.y = 32
        self.speed = 10
        self.goto_x = 0
        self.goto_y = 0
        self.frame = 0
        self.idle_frame = 0
        self.curr_anim = None
        self.sprite_sheet = pygame.image.load("oneko.png").convert_alpha()  # Load the sprite sheet
        self.sprite_width = 32  # Size of each sprite in the sheet
        self.sprite_height = 32
        self.rect = pygame.Rect(self.x, self.y, self.sprite_width, self.sprite_height)

    def set_animation(self, name, duration=200, start_frame=0):
        if self.curr_anim == name:
            return

        self.curr_anim = name
        frames = self.tile_frames(sprite_sets[name])

        if len(frames) > 1:
            # Start animation (for now, just a simple frame switch)
            self.animation = (frames, duration, start_frame)
        else:
            self.animation = None
            self.background_position = frames[0]["backgroundPosition"]

    def tile_frames(self, tile_list):
        return [{"backgroundPosition": f"{x * self.sprite_width}px {y * self.sprite_height}px"} for x, y in tile_list]

    def play_frame(self):
        self.frame += 1

        diff_x = self.x - self.goto_x
        diff_y = self.y - self.goto_y
        distance = math.sqrt(diff_x ** 2 + diff_y ** 2)

        if distance < self.speed or distance < 48:
            self.play_idle_animation()
            return

        if self.idle_frame > 1:
            self.set_animation("alert")
            self.idle_frame = min(self.idle_frame, 7) - 1
            return

        direction = ""
        direction += "N" if diff_y / distance > 0.5 else ""
        direction += "S" if diff_y / distance < -0.5 else ""
        direction += "W" if diff_x / distance > 0.5 else ""
        direction += "E" if diff_x / distance < -0.5 else ""

        self.set_animation(direction, 200, self.frame)

        self.x -= (diff_x / distance) * self.speed
        self.y -= (diff_y / distance) * self.speed

        self.update_position()

    def play_idle_animation(self):
        playing_idle_animation = self.curr_anim in ["sleeping", "scratch", "tired"]

        idle_animation = None
        if self.idle_frame > 10 and not playing_idle_animation and randomInt(0, 200) == 0:
            idle_animation = random.choice(["sleeping", "scratch"])
            self.idle_frame = 0

        if idle_animation == "sleeping" or idle_animation == "tired":
            if self.idle_frame < 8:
                self.set_animation("tired")
            else:
                self.set_animation("sleeping", 1600)
            if self.idle_frame > 192:
                self.idle_frame = 0
                self.set_animation("idle", 0)
        elif idle_animation == "scratch":
            self.set_animation("scratch", 300)
            if self.idle_frame > 9:
                self.idle_frame = 0
                self.set_animation("idle", 0)
        else:
            if not playing_idle_animation:
                self.set_animation("idle", 0)

        self.idle_frame += 1

    def update_position(self):
        self.rect.x = self.x - 16
        self.rect.y = self.y - 16

    def handle_mouse_move(self, x, y):
        self.goto_x = x
        self.goto_y = y

    def handle_mouse_out(self):
        self.goto_x = self.x
        self.goto_y = self.y


# Main game loop
neko = Neko()

# Set up the clock
clock = pygame.time.Clock()

running = True
while running:
    screen.fill((255, 255, 255))  # Clear screen to white

    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEMOTION:
            mouse_x, mouse_y = event.pos
            neko.handle_mouse_move(mouse_x, mouse_y)
        elif event.type == pygame.MOUSEBUTTONUP:
            neko.handle_mouse_out()

    # Update neko's frame
    neko.play_frame()

    # Draw the neko sprite (if using sprite sheet, adjust this line for frame extraction)
    frames = neko.tile_frames(sprite_sets[neko.curr_anim])
    if frames:
        frame = frames[0]  # For simplicity, using the first frame
        frame_pos = pygame.Rect(frame["backgroundPosition"].split())
        screen.blit(neko.sprite_sheet, neko.rect, frame_pos)

    # Update the screen
    pygame.display.update()

    # Control the frame rate
    clock.tick(30)

# Quit pygame
pygame.quit()
