import bpy
def print(data):
    for window in bpy.context.window_manager.windows:
        screen = window.screen
        for area in screen.areas:
            if area.type == 'CONSOLE':
                override = {'window': window, 'screen': screen, 'area': area}
                bpy.ops.console.scrollback_append(override, text=str(data), type="OUTPUT")

#verts = [ bpy.context.object.matrix_world * v.co for v in bpy.context.object.data.vertices ]

verts = [ v.co for v in bpy.context.object.data.vertices ]

points = ["point![" + (str(v[0]) + "," + str(v[1]) + "," + str(v[2])) + "]" for v in verts]

print(points)

arr = "pub const E_HULL_4: [Point3<f32>; "+str(len(verts))+"] = [" + ",".join(points) + "];"

f = open( "/Users/jesseditson/Downloads/data.js", 'w' )
f.writelines( arr )
f.close()

#[str(v) for co in verts for v in co]