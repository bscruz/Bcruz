import pygame
import random
import math
import time

# Initialize pygame
pygame.init()

# Set up the window
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("Neko Follows Mouse")

# Load neko sprite sheet
sprite_sheet = pygame.image.load("img/oneko.png").convert_alpha()  # Assuming you have an image file

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

# Neko properties
neko_pos_x = 32
neko_pos_y = 32
mouse_pos_x = 0
mouse_pos_y = 0
frame_count = 0
idle_time = 0
idle_animation = None
idle_animation_frame = 0
neko_speed = 10

# Function to set sprite
def set_sprite(name, frame):
    sprite = sprite_sets[name][frame % len(sprite_sets[name])]
    return sprite[0] * 32, sprite[1] * 32

# Function to handle idle animations (sleeping, scratching, etc.)
def idle():
    global idle_animation, idle_animation_frame
    global idle_time

    idle_time += 1

    if idle_time > 10 and random.randint(0, 200) == 0 and idle_animation is None:
        idle_animation = random.choice(["sleeping", "scratch"])

    if idle_animation == "sleeping":
        if idle_animation_frame < 8:
            return set_sprite("tired", 0)
        return set_sprite("sleeping", idle_animation_frame // 4)
    elif idle_animation == "scratch":
        return set_sprite("scratch", idle_animation_frame)
    else:
        return set_sprite("idle", 0)

    idle_animation_frame += 1
    return (0, 0)

# Main animation loop to follow mouse and update position
def frame():
    global neko_pos_x, neko_pos_y, mouse_pos_x, mouse_pos_y
    global idle_animation, idle_animation_frame, frame_count

    frame_count += 1
    diff_x = neko_pos_x - mouse_pos_x
    diff_y = neko_pos_y - mouse_pos_y
    distance = math.sqrt(diff_x ** 2 + diff_y ** 2)

    if distance < neko_speed or distance < 48:
        return idle()

    idle_animation = None
    idle_animation_frame = 0

    if idle_time > 1:
        idle_time = min(idle_time, 7)
        idle_time -= 1
        return set_sprite("alert", 0)

    direction = ""
    if diff_y / distance > 0.5:
        direction += "N"
    if diff_y / distance < -0.5:
        direction += "S"
    if diff_x / distance > 0.5:
        direction += "W"
    if diff_x / distance < -0.5:
        direction += "E"

    sprite_pos = set_sprite(direction, frame_count)
    neko_pos_x -= (diff_x / distance) * neko_speed
    neko_pos_y -= (diff_y / distance) * neko_speed

    return sprite_pos

# Create Neko
neko_rect = pygame.Rect(neko_pos_x, neko_pos_y, 32, 32)

# Main game loop
running = True
while running:
    screen.fill((255, 255, 255))  # Clear screen to white

    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEMOTION:
            mouse_pos_x, mouse_pos_y = event.pos

    # Get the sprite for the neko
    sprite_pos = frame()

    # Update the neko position and sprite
    neko_rect.x = neko_pos_x - 16
    neko_rect.y = neko_pos_y - 16

    # Draw the neko sprite
    screen.blit(sprite_sheet, neko_rect, pygame.Rect(sprite_pos[0], sprite_pos[1], 32, 32))

    # Update the screen
    pygame.display.update()

    # Control the frame rate
    pygame.time.Clock().tick(30)

# Quit pygame
pygame.quit()
