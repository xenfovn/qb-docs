---
sidebar_position: 3
---

# Shared Config

The shared.lua file inside qb-core contains all the information for your jobs, vehicles, items & more! You will spend a lot of time in this file configuring everything to your exact specifications. Jenkins hashes are used frequently, you can find more information on those **[here](https://cookbook.fivem.net/2019/06/23/lua-support-for-compile-time-jenkins-hashes/)**

Here is a simplified example:

```
QBShared = {}

-- Utility (can be ignored)

local StringCharset = {}
local NumberCharset = {}

for i = 48,  57 do table.insert(NumberCharset, string.char(i)) end
for i = 65,  90 do table.insert(StringCharset, string.char(i)) end
for i = 97, 122 do table.insert(StringCharset, string.char(i)) end

QBShared.RandomStr = function(length)
	if length > 0 then
		return QBShared.RandomStr(length-1) .. StringCharset[math.random(1, #StringCharset)]
	else
		return ''
	end
end

QBShared.RandomInt = function(length)
	if length > 0 then
		return QBShared.RandomInt(length-1) .. NumberCharset[math.random(1, #NumberCharset)]
	else
		return ''
	end
end

QBShared.SplitStr = function(str, delimiter)
	local result = { }
	local from  = 1
	local delim_from, delim_to = string.find( str, delimiter, from  )
	while delim_from do
		table.insert( result, string.sub( str, from , delim_from-1 ) )
		from  = delim_to + 1
		delim_from, delim_to = string.find( str, delimiter, from  )
	end
	table.insert( result, string.sub( str, from  ) )
	return result
end

-- Utility (can be ignored)

QBShared.StarterItems = { -- The items given to the player on first creation
    ['phone'] = {amount = 1, item = 'phone'},
    ['id_card'] = {amount = 1, item = 'id_card'},
    ['driver_license'] = {amount = 1, item = 'driver_license'},
}

QBShared.Items = {
    ['id_card'] = {
        ['name'] = 'id_card', -- Actual item name for spawning/giving/removing
        ['label'] = 'ID Card', -- Label of item that is shown in inventory slot
        ['weight'] = 0, -- How much the items weighs
        ['type'] = 'item', -- What type the item is (ex: item, weapon)
        ['image'] = 'id_card.png', -- This item image that is found in qb-inventory/html/images (must be same name as ['name'] from above)
        ['unique'] = true, -- Is the item unique (true|false) - Cannot be stacked & accepts item info to be assigned
        ['useable'] = true, -- Is the item useable (true|false) - Must still be registered as useable
        ['shouldClose'] = false, -- Should the item close the inventory on use (true|false)
        ['combinable'] = nil, -- Is the item able to be combined with another? (nil|table)
        ['description'] = 'A card containing all your information to identify yourself' -- Description of time in inventory
    }
}

-- Example of an item that is combinable and not nil

['combinable'] = {
    accept = {'snspistol_part_1'}, -- The other item that can be it can be combined with
    reward = 'snspistol_stage_1', -- The item that is rewarded upon successful combine
    anim = { -- Set the animation, progressbar text and length of time it takes to combine
        ['dict'] = 'anim@amb@business@weed@weed_inspecting_high_dry@', -- The animation dictionary
        ['lib'] = 'weed_inspecting_high_base_inspector', -- The animation library
        ['text'] = 'Atttaching attachments', -- Text that will be displayed in the progress bar
        ['timeOut'] = 15000,} -- How long the animation should take to complete
    }
}

-- Weapons are added to the items table as well as here for hashes (possibly deprecated soon to prevent duplicate entry)

QBShared.Weapons = {
    [`weapon_pistol`] = { -- Weapon hash (uses compile-time Jenkins hashes - See link at bottom of page)
        ['name'] = 'weapon_pistol', -- Actual item name for spawning/giving/removing
        ['label'] = 'Walther P99', -- Label of item that is shown in inventory slot
        ['weight'] = 1000, -- How much the items weighs
        ['type'] = 'weapon', -- What type the item is (ex: item, weapon)
        ['ammotype'] = 'AMMO_PISTOL', -- The type of ammo this weapon accepts
        ['image'] = 'weapon_pistol.png', -- This item image that is found in qb-inventory/html/images (must be same name as ['name'] from above)
        ['unique'] = true, -- Is the item unique (true|false) - Cannot be stacked & accepts item info to be assigned
        ['useable'] = false, -- Is the item useable (true|false) - Must still be registered as useable
        ['description'] = 'A small firearm designed to be held in one hand' -- Description of time in inventory
    }
}

QBShared.Gangs = {
	['mynewgang'] = { -- (table index)
		label = 'My Fancy Gang Name', -- Label of the gang (string)
		grades = {
            ['0'] = { -- The grade to assign with /setgang id gangname grade (table index)
                name = 'I am grade 0'
            },
			['1'] = {
                name = 'I am grade 1' -- Label of the gang grade (string)
            },
			['2'] = {
                name = 'I am grade 2'
            },
			['3'] = {
                name = 'I am grade 3',
				isboss = true -- Indicated this grade as a boss level for certain access (boolean|true)
            },
        },
	}
}

QBShared.Vehicles = {
	['adder'] = { -- Vehicle model/spawn name (string)
		['name'] = 'Adder', -- Desired name/label for the vehicle (string)
		['brand'] = 'Truffade', -- The brand of vehicle (string)
		['model'] = 'adder', -- Vehicle model/spawn name (string)
		['price'] = 280000, -- How much the vehicle costs at the dealership (integer)
		['category'] = 'super', -- The category the vehicle will display in at the dealership (string)
		['hash'] = `adder`, -- Vehicle hash key (jenkins hash || GetHashKey(model))
		['shop'] = 'pdm', -- The desired shop the vehicle is available for sale at (string)
	}
}
```