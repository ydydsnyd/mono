import bpy

#verts = [ bpy.context.object.matrix_world * v.co for v in bpy.context.object.data.vertices ]

verts = [ v.co for v in bpy.context.object.data.vertices ]

flat = [str(v) for co in verts for v in co]

arr = "[" + ",".join(flat) + "]"

f = open( "/Users/jesseditson/Downloads/data.js", 'w' )
f.writelines( arr )
f.close()