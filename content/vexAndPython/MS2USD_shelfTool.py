import os
import hou
import time

root = hou.ui.selectFile(file_type=hou.fileType.Directory)
expand_root = hou.expandString(root)

folders = [name for name in os.listdir(expand_root) if os.path.isdir(os.path.join(expand_root, name))]

hou.ui.displayMessage('Asset {} will be created'.format(folders))

fbx_file = 'n'
diff_file = 'n'
rough_file = 'n'
norm_file = 'n'

def createAsset(name, pathToFBX, pathToDiff, pathToRough, pathToNorm):
    stage = hou.node('/stage/')
    import_name = name + "_import"
    
    component = stage.createNode('componentgeometry', import_name)
    comInside = hou.node('/stage/{}/sopnet/geo/'.format(import_name))

    file = comInside.createNode('file')
    file.parm('file').set(pathToFBX)

    tS = comInside.createNode("xform")
    tS.parm("scale").set(0.01)

    tS.setInput(0, file)

    comOut = hou.node('/stage/{}/sopnet/geo/default'.format(import_name))

    comOut.setInput(0, tS)

    mtl = stage.createNode('materiallibrary')
    mtl.parm('matpathprefix').set('/ASSET/mtl/')

    karma_material = mtl.createNode("principledshader::2.0", "karma_material")
    karma_material.parm("basecolor_texture").set(pathToDiff) # 
    karma_material.parm("basecolor_useTexture").set(1)
    
    karma_material.parm("rough_texture").set(pathToRough) # 
    karma_material.parm("rough_useTexture").set(1)
    
    karma_material.parm("baseBumpAndNormal_enable").set(1)
    karma_material.parm("baseNormal_texture").set(pathToNorm) # 
        
    setMat = stage.createNode('componentmaterial')

    out = stage.createNode('componentoutput', name)

    setMat.setInput(0, component)
    setMat.setInput(1, mtl)
    out.setInput(0, setMat)

    out.setDisplayFlag(True)
    out.parm('execute').pressButton()
    
for folder in folders:
    files = os.listdir(os.path.join(expand_root,folder))
    filePath = os.path.join(expand_root, folder)
    name = folder.replace(' ', '')
    name = name.replace('3', 'TRI')
    for file in files:
        if '_lod0.fbx' in file.lower():
            fbx_file = os.path.join(filePath, file)
        if 'albedo.jpg' in file.lower():
            diff_file = os.path.join(filePath, file)
        if 'roughness' in file.lower():
            rough_file = os.path.join(filePath, file)
        if 'normal_lod0.jpg' in file.lower():
            norm_file = os.path.join(filePath, file)
    createAsset(name, fbx_file, diff_file, rough_file, norm_file)

hou.ui.displayMessage("DON!")