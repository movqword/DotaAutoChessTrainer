var eEffectType = { Role: 0, Class: 1 };
var eEffectRule = { None: 0, RoleBattleground: 1, ClassBattleground: 2, RoleBattlegroundUnique: 3, ClassBattlegroundUnique: 4 };
var eEffectBuffTargetType = { None: 0, Friend: 1, Enemy: 2 };
var eEffectBuffTargetFilter = { None: 0, Role: 1, Class: 2 };

function GetHeroInfo(id) {
    for (var i = 0; i < hero_data.length; i++) {
        if (hero_data[i].id == id) {
            return hero_data[i];
        }
    }

    return null;
}

function GetHeroColor(hero_info) {
    var color = ["#FFFFFF", "#B6BABB", "#C0C3E4", "#4C4AD2", "#D51DD5", "#DC8B30"];
    return color[hero_info.cost];
}

function GetRoleInfo(id) {
    for (var i = 0; i < role_data.length; i++) {
        if (role_data[i].id == id) {
            return role_data[i];
        }
    }

    return null;
}

function GetRoleColor(role_info) {
    var color = ["#C10033", "#3F7F29", "#22B9D4", "#4D5152", "#AD3C12", "#929688", "#197BD6", "#FEFFFF", "#961FD3", "#3E37A9", "#961B20", "#9D5642", "#DFEC7A"];
    return color[role_info.id];
}

function GetClassInfo(id) {
    for (var i = 0; i < class_data.length; i++) {
        if (class_data[i].id == id) {
            return class_data[i];
        }
    }

    return null;
}

function GetClassColor(class_info) {
    var color = ["#B89984", "#DE7F2F", "#77C1EE", "#B9D67C", "#EFF190", "#A07117", "#335DF1", "#CC819F", "#3E0B50", "#7D76A2"];
    return color[class_info.id];
}

function UpdateShareLink() {
    var share_link_el = document.getElementById("share_link");
    share_link_el.innerHTML = window.location.protocol + "//" + window.location.host + "/?build=";

    for (var i = 0; i < board1.items.length; i++) {
        var item = board1.items[i];

        if (item.Empty()) {
            continue;
        }

        share_link_el.innerHTML += i + "-" + item.hero + ",";
    }

    share_link_el.innerHTML = share_link_el.innerHTML.slice(0, -1);
    share_link_el.innerHTML += "&enemy="

    for (var i = 0; i < board2.items.length; i++) {
        var item = board2.items[i];

        if (item.Empty()) {
            continue;
        }

        share_link_el.innerHTML += i + "-" + item.hero + ",";
    }

    share_link_el.innerHTML = share_link_el.innerHTML.slice(0, -1);
}

function ResetBoard(type) {
    if (type == 0 && board1.GetItemCount() < 1) {
        return;
    }
    else if (type == 1 && board2.GetItemCount() < 1) {
        return;
    }

    if (!confirm("You are sure want reset board?")) {
        return;
    }

    if (type == 0) {
        board1.Clear();
        board1.Update();
    }
    else if (type == 1) {
        board2.Clear();
        board2.Update();
    }
}

class HeroPickerFilterItem {
    constructor(filter, type, id) {
        this.filter = filter;
        this.type = type;
        this.id = id;
    }

    OnClick(event) {
        if (this.type == 0) {
            var pre_item_el = document.getElementById("hero_picker_filter_role_" + (this.filter.picker.role_id == -1 ? "none" : this.filter.picker.role_id));
            var cur_item_el = document.getElementById("hero_picker_filter_role_" + (this.id == -1 ? "none" : this.id));

            pre_item_el.className = "hero_picker_filter_item";
            cur_item_el.className = "hero_picker_filter_item selected";

            this.filter.picker.role_id = this.id;
        }
        else if (this.type == 1) {
            var pre_item_el = document.getElementById("hero_picker_filter_class_" + (this.filter.picker.class_id == -1 ? "none" : this.filter.picker.class_id));
            var cur_item_el = document.getElementById("hero_picker_filter_class_" + (this.id == -1 ? "none" : this.id));

            pre_item_el.className = "hero_picker_filter_item";
            cur_item_el.className = "hero_picker_filter_item selected";

            this.filter.picker.class_id = this.id;
        }

        this.filter.picker.Update();
    }
}

class HeroPickerFilter {
    constructor(picker, id) {
        this.picker = picker;
        this.id = id;
        this.role_filter = [];
        this.class_filter = [];

        for (var i = -1; i < role_data.length; i++) {
            this.role_filter.push(new HeroPickerFilterItem(this, 0, i == -1 ? -1 : role_data[i].id));
        }

        for (var i = -1; i < class_data.length; i++) {
            this.class_filter.push(new HeroPickerFilterItem(this, 1, i == -1 ? -1 : class_data[i].id));
        }
    }

    Init() {
        var picker_filter_el = document.getElementById(this.id);

        for (var i = 0; i < this.role_filter.length; i++) {
            var item = this.role_filter[i];
            var item_el = document.createElement("div");

            item_el.addEventListener("click", item.OnClick.bind(item));

            if (item.id == -1) {
                item_el.id = "hero_picker_filter_role_none";
                item_el.className = "hero_picker_filter_item selected";
                item_el.innerHTML = "All";
                picker_filter_el.appendChild(item_el);
                continue;
            }

            var role_info = GetRoleInfo(item.id);

            item_el.id = "hero_picker_filter_role_" + item.id;
            item_el.className = "hero_picker_filter_item";

            var title_el = document.createElement("font");
            title_el.color = GetRoleColor(role_info);
            title_el.innerHTML = role_info.name;

            var icon_el = document.createElement("img");
            icon_el.className = "hero_picker_filter_item_icon";
            icon_el.src = "static/images/effect_icons/" + role_info.icon;

            item_el.appendChild(icon_el);
            item_el.appendChild(title_el);

            if (role_info.effect != null) {
                var tooltip_el = document.createElement("div");
                tooltip_el.className = "tooltip";
                tooltip_el.innerHTML = role_info.name + " combo - " + role_info.effect.name + "<br>";

                var effect_rule_el = document.createElement("span");
                effect_rule_el.className = "hero_picker_filter_item_rule";

                if (role_info.effect.rule == eEffectRule.None) {
                    effect_rule_el.innerHTML = "<br>";
                }
                else if (role_info.effect.rule == eEffectRule.RoleBattleground) {
                    effect_rule_el.innerHTML = "Required N different " + role_info.name + "'s on the board<br><br>";
                }
                else if (role_info.effect.rule == eEffectRule.RoleBattlegroundUnique) {
                    effect_rule_el.innerHTML = "Required no more than N " + role_info.name + "'s on the board<br><br>";
                }

                tooltip_el.appendChild(effect_rule_el);

                for (var n = 0; n < role_info.effect.buff.length; n++) {
                    var effect_info = role_info.effect.buff[n];

                    for (var j = 0; j < effect_info.bonus.length; j++) {
                        var effect_line_el = document.createElement("span");
                        effect_line_el.className = "hero_picker_filter_item_effect buff";

                        if (role_info.effect.rule != eEffectRule.None) {
                            effect_line_el.innerHTML = "(" + effect_info.required + ") ";
                        }

                        effect_line_el.innerHTML += effect_info.bonus[j].text + effect_info.bonus[j].value;

                        if (effect_info.target.filter == eEffectBuffTargetFilter.None) {
                            if (effect_info.target.random) {
                                effect_line_el.innerHTML += "<span class='hero_picker_filter_item_rule'>" + (effect_info.target.type == eEffectBuffTargetType.Friend ? " [Random friendly]" : " [Random enemy]") + "</span><br>";
                            }
                            else {
                                effect_line_el.innerHTML += "<span class='hero_picker_filter_item_rule'>" + (effect_info.target.type == eEffectBuffTargetType.Friend ? " [All friendly]" : " [All enemy]") + "</span><br>";
                            }
                        }
                        else if (effect_info.target.filter == eEffectBuffTargetFilter.Role) {
                            effect_line_el.innerHTML += "<span class='hero_picker_filter_item_rule'> [Friendly " + role_info.name + "'s]</span><br>";
                        }

                        tooltip_el.appendChild(effect_line_el);
                    }
                }

                item_el.appendChild(tooltip_el);
            }

            picker_filter_el.appendChild(item_el);
        }

        for (var i = 0; i < this.class_filter.length; i++) {
            var item = this.class_filter[i];
            var item_el = document.createElement("div");

            item_el.addEventListener("click", item.OnClick.bind(item));

            if (item.id == -1) {
                item_el.id = "hero_picker_filter_class_none";
                item_el.className = "hero_picker_filter_item selected";
                item_el.innerHTML = "All";
                picker_filter_el.appendChild(item_el);
                continue;
            }

            var class_info = GetClassInfo(item.id);

            item_el.id = "hero_picker_filter_class_" + item.id;
            item_el.className = "hero_picker_filter_item";

            var title_el = document.createElement("font");
            title_el.color = GetClassColor(class_info);
            title_el.innerHTML = class_info.name;

            var icon_el = document.createElement("img");
            icon_el.className = "hero_picker_filter_item_icon";
            icon_el.src = "static/images/effect_icons/" + class_info.icon;

            item_el.appendChild(icon_el);
            item_el.appendChild(title_el);

            if (class_info.effect != null) {
                var tooltip_el = document.createElement("div");
                tooltip_el.className = "tooltip";
                tooltip_el.innerHTML = class_info.name + " combo - " + class_info.effect.name + "<br>";

                var effect_rule_el = document.createElement("span");
                effect_rule_el.className = "hero_picker_filter_item_rule";

                if (class_info.effect.rule == eEffectRule.None) {
                    effect_rule_el.innerHTML = "<br>";
                }
                else if (class_info.effect.rule == eEffectRule.ClassBattleground) {
                    effect_rule_el.innerHTML = "Required N different " + class_info.name + "'s on the board<br><br>";
                }
                else if (class_info.effect.rule == eEffectRule.ClassBattlegroundUnique) {
                    effect_rule_el.innerHTML = "Required no more than N " + class_info.name + "'s on the board<br><br>";
                }

                tooltip_el.appendChild(effect_rule_el);

                for (var n = 0; n < class_info.effect.buff.length; n++) {
                    var effect_info = class_info.effect.buff[n];

                    var effect_line_el = document.createElement("span");
                    effect_line_el.className = "hero_picker_filter_item_effect buff";

                    if (class_info.effect.rule != eEffectRule.None) {
                        effect_line_el.innerHTML = "(" + effect_info.required + ") ";
                    }

                    for (var j = 0; j < effect_info.bonus.length; j++) {
                        effect_line_el.innerHTML += effect_info.bonus[j].text + effect_info.bonus[j].value;

                        if (effect_info.target.filter == eEffectBuffTargetFilter.None) {
                            if (effect_info.target.random) {
                                effect_line_el.innerHTML += "<span class='hero_picker_filter_item_rule'>" + (effect_info.target.type == eEffectBuffTargetType.Friend ? " [Random friendly]" : " [Random enemy]") + "</span><br>";
                            }
                            else {
                                effect_line_el.innerHTML += "<span class='hero_picker_filter_item_rule'>" + (effect_info.target.type == eEffectBuffTargetType.Friend ? " [All friendly]" : " [All enemy]") + "</span><br>";
                            }
                        }
                        else if (effect_info.target.filter == eEffectBuffTargetFilter.Class) {
                            effect_line_el.innerHTML += "<span class='hero_picker_filter_item_rule'> [Friendly " + class_info.name + "'s]</span><br>";
                        }

                        tooltip_el.appendChild(effect_line_el);
                    }
                }

                item_el.appendChild(tooltip_el);
            }

            picker_filter_el.appendChild(item_el);
        }
    }
}

class HeroPickerItem {
    constructor(hero) {
        this.hero = hero;
    }

    OnDragStart(event) {
        var hero_info = GetHeroInfo(this.hero);

        var hero_icon_el = document.createElement("img");
        hero_icon_el.src = "static/images/hero_icons/" + hero_info.icon;

        event.dataTransfer.setData("text", "hero: " + this.hero);
        event.dataTransfer.setDragImage(hero_icon_el, 0, 0);
    }
}

class HeroPicker {
    constructor(id) {
        this.id = id;
        this.items = [];
        this.active = false;
        this.role_id = -1;
        this.class_id = -1;
        this.touch_position = [];
        this.touch_time = 0;
    }

    Init() {
        var picker_el = document.getElementById(this.id);

        picker_el.innerHTML = "";

        picker_el.addEventListener("mouseover", this.OnMouseOver.bind(this));
        picker_el.addEventListener("mouseout", this.OnMouseOut.bind(this));
        picker_el.addEventListener("touchstart", this.OnTouchStart.bind(this));
        picker_el.addEventListener("touchend", this.OnTouchEnd.bind(this));
        picker_el.addEventListener("touchmove", this.OnTouchMove.bind(this));

        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
            picker_el.addEventListener("DOMMouseScroll", this.OnMouseWheel.bind(this));
        }
        else {
            picker_el.addEventListener("mousewheel", this.OnMouseWheel.bind(this));
        }

        this.Update();
    }

    Update() {
        var picker_el = document.getElementById(this.id);

        picker_el.innerHTML = "";

        for (var i = 0; i < hero_data.length; i++) {
            var hero_info = hero_data[i];

            if (!this.CheckFilterRole(hero_info) || !this.CheckFilterClass(hero_info)) {
                continue;
            }

            this.items[i] = new HeroPickerItem(hero_info.id);
            var hero_item = this.items[i];

            var hero_item_el = document.createElement("div");
            hero_item_el.className = "hero_picker_item";
            hero_item_el.draggable = true;
            hero_item_el.addEventListener("dragstart", hero_item.OnDragStart.bind(hero_item))

            var hero_icon_el = document.createElement("img");
            hero_icon_el.width = 32;
            hero_icon_el.height = 32;
            hero_icon_el.src = "static/images/hero_icons/" + hero_info.icon;

            var hero_name_el = document.createElement("span");
            hero_name_el.className = "hero_picker_item_name";
            hero_name_el.innerHTML = "<font color='" + GetHeroColor(hero_info) + "'>" + hero_info.name + "</font>";

            var hero_role_el = document.createElement("span");
            hero_role_el.className = "hero_picker_item_role";

            for (var n = 0; n < hero_info.role.length; n++) {
                var role_info = GetRoleInfo(hero_info.role[n]);

                hero_role_el.innerHTML += "<font color='" + GetRoleColor(role_info) + "'>" + role_info.name + "</font>";

                if (n != hero_info.role.length - 1) {
                    hero_role_el.innerHTML += " ";
                }
            }

            var hero_class_el = document.createElement("span");
            hero_class_el.className = "hero_picker_item_class";

            for (var n = 0; n < hero_info.class.length; n++) {
                var class_info = GetClassInfo(hero_info.class[n]);

                hero_class_el.innerHTML += "<font color='" + GetClassColor(class_info) + "'>" + class_info.name + "</font>";

                if (n != hero_info.class.length - 1) {
                    hero_class_el.innerHTML += " ";
                }
            }

            hero_item_el.appendChild(hero_icon_el);
            hero_item_el.appendChild(hero_name_el);
            hero_item_el.appendChild(hero_role_el);
            hero_item_el.appendChild(hero_class_el);

            picker_el.appendChild(hero_item_el);
        }
    }

    CheckFilterRole(hero_info) {
        if (this.role_id == -1) {
            return true;
        }

        for (var i = 0; i < hero_info.role.length; i++) {
            if (hero_info.role[i] == this.role_id) {
                return true;
            }
        }

        return false;
    }

    CheckFilterClass(hero_info) {
        if (this.class_id == -1) {
            return true;
        }

        for (var i = 0; i < hero_info.class.length; i++) {
            if (hero_info.class[i] == this.class_id) {
                return true;
            }
        }

        return false;
    }

    OnMouseOver(event) {
        this.active = true;
    }

    OnMouseOut(event) {
        this.active = false;
    }

    OnMouseWheel(event) {
        if (!hero_picker.active) {
            return;
        }

        var delta = 0;

        if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
            delta = event.detail * -120;
        }
        else {
            delta = event.wheelDelta;
        }

        if (delta < 0) {
            document.getElementById("hero_picker").scrollLeft += 150;
        } else {
            document.getElementById("hero_picker").scrollLeft -= 150;
        }

        event.preventDefault();
    }

    OnTouchStart(event) {
        var touch_info = event.changedTouches[0];

        this.touch_position[0] = touch_info.pageX;
        this.touch_position[1] = touch_info.pageY;
        this.touch_time = new Date().getTime();

        event.preventDefault();
    }

    OnTouchEnd(event) {
        event.preventDefault();
    }

    OnTouchMove(event) {
        var touch_info = event.changedTouches[0];

        var end_position = [touch_info.pageX - this.touch_position[0], touch_info.pageY - this.touch_position[1]];
        var end_time = new Date().getTime() - this.touch_time;

        if (end_time > 300) {
            event.preventDefault();
            return;
        }

        var direction = "none";

        if (Math.abs(end_position[0]) >= 150 && Math.abs(end_position[1]) <= 100) {
            direction = end_position[0] < 0 ? "left" : "right";
        }
        else if (Math.abs(end_position[1]) >= 150 && Math.abs(end_position[0]) <= 100) {
            direction = end_position[1] < 0 ? "up" : "down";
        }

        if (direction == "left") {
            document.getElementById("hero_picker").scrollLeft += 60;
        }
        else if (direction == "right") {
            document.getElementById("hero_picker").scrollLeft -= 60;
        }

        event.preventDefault();
    }
}

class BattleBoardEffect {
    constructor(type, id, index) {
        this.type = type;
        this.id = id;
        this.index = index;
    }
}

class BattleBoardItem {
    constructor(board, index) {
        this.board = board;
        this.index = index;

        this.Clear();
    }

    Empty() {
        return this.hero == -1;
    }

    Clear() {
        this.hero = -1;
        this.ClearEffect();
    }

    ClearEffect() {
        this.buffs = [];
        this.debuffs = [];
    }

    AddBuff(type, id, index) {
        this.buffs.push(new BattleBoardEffect(type, id, index));
    }

    HaveBuff(type, id, index) {
        for (var i = 0; i < this.buffs.length; i++) {
            var buff = this.buffs[i];

            if (buff.type == type && buff.id == id && buff.index == index) {
                return true;
            }
        }

        return false;
    }

    AddDebuff(type, id, index) {
        this.debuffs.push(new BattleBoardEffect(type, id, index));
    }

    HaveDebuff(type, id, index) {
        for (var i = 0; i < this.debuffs.length; i++) {
            var debuff = this.debuffs[i];

            if (debuff.type == type && debuff.id == id && debuff.index == index) {
                return true;
            }
        }

        return false;
    }

    HaveEffect(type, id, index) {
        if (HaveBuff(type, id, index) || HaveDebuff(type, id, index)) {
            return true;
        }

        return false;
    }

    OnClick(event) {
        if (this.Empty()) {
            return;
        }

        var hero_info = GetHeroInfo(this.hero);

        if (hero_info == null) {
            return;
        }

        if (!confirm("You are sure want delete " + hero_info.name + "?")) {
            return;
        }

        this.Clear();
        this.board.Update();
    }

    OnDragStart(event) {
        var hero_info = GetHeroInfo(this.hero);

        var hero_icon_el = document.createElement("img");
        hero_icon_el.src = "static/images/hero_icons/" + hero_info.icon;

        event.dataTransfer.setData("text", "hero: " + this.hero);
        event.dataTransfer.setDragImage(hero_icon_el, 0, 0);

        this.Clear();
    }

    OnDragOver(event) {
        event.preventDefault();
    }

    OnDragDrop(event) {
        event.preventDefault();

        var drop_data = event.dataTransfer.getData("text");

        if (drop_data == null || drop_data.search("hero: ") == -1) {
            return;
        }

        var hero_id = drop_data.replace("hero: ", "");
        var hero_info = GetHeroInfo(hero_id);

        if (hero_info == null) {
            return;
        }

        if (this.board.GetItemCount() >= 10) {
            alert("You have exceeded maximum hero count.");
            return;
        }

        if (!this.Empty() && !confirm("You are sure want replace " + GetHeroInfo(this.hero).name + "?")) {
            return;
        }

        this.hero = hero_id;
        this.board.Update();
    }
}

class BattleBoard {
    constructor(id, display, width, height) {
        this.id = id;
        this.display = display;
        this.width = width;
        this.height = height;
        this.items = [];

        for (var i = 0; i < width * height; i++) {
            this.items[i] = new BattleBoardItem(this, i);
        }
    }

    Init() {
        var board_el = document.getElementById(this.id);

        board_el.innerHTML = "";

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var item_el = document.createElement("div");

            item_el.id = i;
            item_el.className = "battleground_board_cell";

            item_el.addEventListener("click", item.OnClick.bind(item));
            item_el.addEventListener("dragstart", item.OnDragStart.bind(item));
            item_el.addEventListener("dragover", item.OnDragOver.bind(item));
            item_el.addEventListener("drop", item.OnDragDrop.bind(item));

            board_el.appendChild(item_el);
        }
    }

    Clear() {
        for (var i = 0; i < this.width * this.height; i++) {
            this.items[i] = new BattleBoardItem(this, i);
        }

        this.Init();
    }

    Update() {
        this.UpdateEffect();
        this.UpdateDisplay();

        var board_el = document.getElementById(this.id);

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var item_el = board_el.childNodes[i];

            item_el.innerHTML = "";
            item_el.style.cursor = "default";

            if (item.Empty()) {
                continue;
            }

            var hero_info = GetHeroInfo(item.hero);

            var hero_icon_el = document.createElement("img");
            hero_icon_el.src = "static/images/hero_icons/" + hero_info.icon;

            var buff_info_el = document.createElement("span");
            buff_info_el.className = "battleground_board_cell_buff";
            buff_info_el.innerHTML = item.buffs.length;

            var debuff_info_el = document.createElement("span");
            debuff_info_el.className = "battleground_board_cell_debuff";
            debuff_info_el.innerHTML = item.debuffs.length;

            item_el.appendChild(hero_icon_el);
            item_el.appendChild(buff_info_el);
            item_el.appendChild(debuff_info_el);

            item_el.style.cursor = "pointer";

            var hero_tooltip_el = document.createElement("div");
            hero_tooltip_el.className = "tooltip";
            hero_tooltip_el.innerHTML += hero_info.name + "<br>";

            for (var n = 0; n < hero_info.role.length; n++) {
                var role_info = GetRoleInfo(hero_info.role[n]);
                hero_tooltip_el.innerHTML += "<font class='battleground_combo_role' color='" + GetRoleColor(role_info) + "'>" + role_info.name + "</font> ";
            }

            hero_tooltip_el.innerHTML += "<br>";

            for (var n = 0; n < hero_info.class.length; n++) {
                var class_info = GetClassInfo(hero_info.class[n]);
                hero_tooltip_el.innerHTML += "<font class='battleground_combo_role' color='" + GetClassColor(class_info) + "'>" + class_info.name + "</font> ";
            }

            hero_tooltip_el.innerHTML += "<br><br>";

            if (item.buffs.length < 1 && item.debuffs.length < 1) {
                item_el.appendChild(hero_tooltip_el);
                continue;
            }

            for (var n = 0; n < item.buffs.length; n++) {
                var buff = item.buffs[n];
                var base_info = buff.type == eEffectType.Role ? GetRoleInfo(buff.id) : GetClassInfo(buff.id);
                var buff_info = base_info.effect.buff[buff.index];

                var buff_icon = document.createElement("img");
                buff_icon.className = "hero_picker_filter_item_icon";
                buff_icon.src = "static/images/effect_icons/" + base_info.icon;

                hero_tooltip_el.appendChild(buff_icon);

                hero_tooltip_el.innerHTML += "<br>";

                for (var j = 0; j < buff_info.bonus.length; j++) {
                    hero_tooltip_el.innerHTML += "<font color='#b9c5d6'>" + buff_info.bonus[j].text + buff_info.bonus[j].value + "</font>";

                    if (buff_info.target.random && buff_info.target.type == eEffectBuffTargetType.Friend) {
                        hero_tooltip_el.innerHTML += " <font class='hero_picker_filter_item_rule'>[Random]</font>";
                    }

                    hero_tooltip_el.innerHTML += "<br>";
                }
            }

            for (var n = 0; n < item.debuffs.length; n++) {
                var buff = item.debuffs[n];
                var base_info = buff.type == eEffectType.Role ? GetRoleInfo(buff.id) : GetClassInfo(buff.id);
                var buff_info = base_info.effect.buff[buff.index];

                var buff_icon = document.createElement("img");
                buff_icon.className = "hero_picker_filter_item_icon";
                buff_icon.src = "static/images/effect_icons/" + base_info.icon;

                hero_tooltip_el.appendChild(buff_icon);

                hero_tooltip_el.innerHTML += "<br>";

                for (var j = 0; j < buff_info.bonus.length; j++) {
                    hero_tooltip_el.innerHTML += "<font color='#b9c5d6'>" + buff_info.bonus[j].text + buff_info.bonus[j].value + "</font>";

                    if (buff_info.target.random && buff_info.target.type == eEffectBuffTargetType.Friend) {
                        hero_tooltip_el.innerHTML += " <font class='hero_picker_filter_item_rule'>[Random]</font>";
                    }

                    hero_tooltip_el.innerHTML += "<br>";
                }
            }

            item_el.appendChild(hero_tooltip_el);
        }

        UpdateShareLink();
    }

    UpdateEffect() {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].ClearEffect();
        }
		
		for (var class_id = 0; class_id < class_data.length; class_id++) {
            var effect_info = class_data[class_id].effect;

            if (effect_info == null) {
                continue;
            }

            this.PushEffect(eEffectType.Class, class_data[class_id], effect_info);
        }

        for (var role_id = 0; role_id < role_data.length; role_id++) {
            var effect_info = role_data[role_id].effect;

            if (effect_info == null) {
                continue;
            }

            this.PushEffect(eEffectType.Role, role_data[role_id], effect_info);
        }
    }

    PushEffect(type, base_info, effect_info) {
        for (var effect_index = 0; effect_index < effect_info.buff.length; effect_index++) {
            var buff_info = effect_info.buff[effect_index];
			
            if (effect_info.rule == eEffectRule.RoleBattleground && buff_info.required > this.GetRoleCount(base_info.id)) {
                continue;
            }
            else if (effect_info.rule == eEffectRule.ClassBattleground && buff_info.required > this.GetClassCount(base_info.id)) {
                continue;
            }
            else if (effect_info.rule == eEffectRule.RoleBattlegroundUnique && buff_info.required != this.GetRoleCount(base_info.id)) {
				if (base_info.id == 8 && this.HaveBuff(eEffectType.Class, 8, 1)) {
					
				}
				else {
					continue;
				}
            }
            else if (effect_info.rule == eEffectRule.ClassBattlegroundUnique && buff_info.required != this.GetClassCount(base_info.id)) {
				
                continue;
            }

            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];

                if (item.Empty()) {
                    continue;
                }

                if (buff_info.target.random && buff_info.target.type == eEffectBuffTargetType.Friend && (this.HaveBuff(type, base_info.id, effect_index) || this.HaveDebuff(type, base_info.id, effect_index))) {
                    continue;
                }

                var hero_info = GetHeroInfo(item.hero);
                var hero_filter = buff_info.target.filter == eEffectBuffTargetFilter.None ? true : false;

                if (buff_info.target.filter == eEffectBuffTargetFilter.Role) {
                    for (var role_index = 0; role_index < hero_info.role.length; role_index++) {
                        if (base_info.id == hero_info.role[role_index]) {
                            hero_filter = true;
                            break;
                        }
                    }
                }
                else if (buff_info.target.filter == eEffectBuffTargetFilter.Class) {
                    for (var class_index = 0; class_index < hero_info.class.length; class_index++) {
                        if (base_info.id == hero_info.class[class_index]) {
                            hero_filter = true;
                            break;
                        }
                    }
                }

                if (hero_filter != true) {
                    continue;
                }

                if (buff_info.target.type == eEffectBuffTargetType.Friend) {
                    item.AddBuff(type, base_info.id, effect_index);
                }
                else if (buff_info.target.type == eEffectBuffTargetType.Enemy) {
                    item.AddDebuff(type, base_info.id, effect_index);
                }
            }
        }
    }

    UpdateDisplay() {
        var display_el = document.getElementById(this.display);
        display_el.innerHTML = "";

        for (var role_id = 0; role_id < role_data.length; role_id++) {
            var effect_info = role_data[role_id].effect;

            if (effect_info == null) {
                continue;
            }

            this.PushDisplay(eEffectType.Role, role_data[role_id], effect_info);
        }

        for (var class_id = 0; class_id < class_data.length; class_id++) {
            var effect_info = class_data[class_id].effect;

            if (effect_info == null) {
                continue;
            }

            this.PushDisplay(eEffectType.Class, class_data[class_id], effect_info);
        }
    }

    PushDisplay(type, base_info, effect_info) {
        var display_el = document.getElementById(this.display);

        var effect_name_el = document.createElement("span");
        effect_name_el.className = "battleground_combo_name";

        if (this.HaveBuff(type == eEffectType.Role ? eEffectType.Role : eEffectType.Class, base_info.id, 0)) {
            effect_name_el.className += " buff";
            effect_name_el.innerHTML = base_info.name + " buff";
        }
        else if (this.HaveDebuff(type == eEffectType.Role ? eEffectType.Role : eEffectType.Class, base_info.id, 0)) {
            effect_name_el.className += " debuff";
            effect_name_el.innerHTML = base_info.name + " debuff";
        }
        else {
            return;
        }

        display_el.appendChild(effect_name_el);

        for (var i = 0; i < effect_info.buff.length; i++) {
            var active = true;

            if (!this.HaveBuff(type == eEffectType.Role ? eEffectType.Role : eEffectType.Class, base_info.id, i) && !this.HaveDebuff(type == eEffectType.Role ? eEffectType.Role : eEffectType.Class, base_info.id, i)) {
                active = false;
            }

            for (var n = 0; n < effect_info.buff[i].bonus.length; n++) {
                var effect_info_el = document.createElement("span");
                effect_info_el.className = "battleground_combo_effect" + (active ? " active" : "");
                effect_info_el.innerHTML = "(" + effect_info.buff[i].required + ") " + effect_info.buff[i].bonus[n].text + effect_info.buff[i].bonus[n].value;

                display_el.appendChild(effect_info_el);
            }
        }

        display_el.lastChild.className += " last";
    }

    GetRoleCount(id) {
        var counter = {};

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];

            if (item.Empty()) {
                continue;
            }

            var hero_info = GetHeroInfo(item.hero);
            var founded = false;

            for (var n = 0; n < hero_info.role.length; n++) {
                if (hero_info.role[n] == id) {
                    founded = true;
                    break;
                }
            }

            if (!founded) {
                continue;
            }

            if (counter[hero_info.id] != undefined) {
                continue;
            }

            counter[hero_info.id] = true;
        }

        return Object.keys(counter).length;
    }

    GetClassCount(id) {
        var counter = {};

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];

            if (item.Empty()) {
                continue;
            }

            var hero_info = GetHeroInfo(item.hero);
            var founded = false;

            for (var n = 0; n < hero_info.class.length; n++) {
                if (hero_info.class[n] == id) {
                    founded = true;
                    break;
                }
            }

            if (!founded) {
                continue;
            }

            if (counter[hero_info.id] != undefined) {
                continue;
            }

            counter[hero_info.id] = true;
        }

        return Object.keys(counter).length;
    }

    HaveBuff(type, id, index) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].HaveBuff(type, id, index)) {
                return true;
            }
        }

        return false;
    }

    HaveDebuff(type, id, index) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].HaveDebuff(type, id, index)) {
                return true;
            }
        }

        return false;
    }

    GetItemCount() {
        var count = 0;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].Empty()) {
                continue;
            }

            count++;
        }

        return count;
    }
}

var hero_picker = new HeroPicker("hero_picker");
var hero_picker_filter = new HeroPickerFilter(hero_picker, "hero_picker_filter");
var board1 = new BattleBoard("battleground_board_self", "battleground_combo_self", 4, 8);
var board2 = new BattleBoard("battleground_board_enemy", "battleground_combo_enemy", 4, 8);

document.addEventListener("LangLoaded", function (event) {
    hero_picker_filter.Init();
    hero_picker.Init();
    board1.Init();
    board2.Init();

    var url = new URL(window.location.href);
    var build = url.searchParams.get("build");
    var enemy = url.searchParams.get("enemy");

    if (build != null && build != "") {
        var board_info = build.split(",");

        for (var i = 0; i < board_info.length; i++) {
            var cell_info = board_info[i].split("-");
            board1.items[cell_info[0]].hero = cell_info[1];
        }

        board1.Update();
    }

    if (enemy != null && enemy != "") {
        var board_info = enemy.split(",");

        for (var i = 0; i < board_info.length; i++) {
            var cell_info = board_info[i].split("-");
            board2.items[cell_info[0]].hero = cell_info[1];
        }

        board2.Update();
    }
});