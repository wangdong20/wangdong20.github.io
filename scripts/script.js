$(function() {
	loadProperties();
})

function loadProperties() {
	$.i18n.properties({
		name:'strings', // 资源文件名称
		path:'i18n/', // 资源文件路径
		mode:'both', // 用 Map 的方式使用资源文件中的值
		async: true,
		callback: function() {
			$('#a_about').text($.i18n.prop('string_about'));
			$('#a_apps').text($.i18n.prop('string_apps'));
			$('#a_contact').text($.i18n.prop('string_contact'));
			$('#my_name').text($.i18n.prop('string_my_name'));
			$('#my_title').text($.i18n.prop('string_my_title'));
			$('#self_introduction').text($.i18n.prop('string_self_introduction'));
			$('#bePatron').text($.i18n.prop('string_bePatron'));
			$('#support_on_paypal').text($.i18n.prop('string_supportPaypal'));
			$('#sudoku_app_name').text($.i18n.prop('string_sudoku_app_name'));
			$('#battleship_app_name').text($.i18n.prop('string_battleship_app_name'));
			$('#fingerdancer_app_name').text($.i18n.prop('string_fingerdancer_app_name'));
			$('#fruitslotmachine_app_name').text($.i18n.prop('string_fruitslotmachine_app_name'));
			$('#contact').text($.i18n.prop('string_keep_in_touch'));
			$('#bottom_supportPaypal').text($.i18n.prop('string_bottom_supportPaypal'));
			$('#copyright').text($.i18n.prop('string_copyright'));
		}
	})
}