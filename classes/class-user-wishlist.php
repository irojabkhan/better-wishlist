<?php

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
    die;
}

if (!class_exists('User_Wishlist')) {
    class User_Wishlist
    {
        protected static $instance;

        public static function get_instance()
        {
            if (is_null(self::$instance)) {
                self::$instance = new self();
            }

            return self::$instance;
        }

        public $user_id;

        private $token;

        private $default_name;

        private $default_privacy;

        private $session_id;

        private $is_default;

        private $slug;

        public function __construct()
        {
            $this->user_id = get_current_user_id();
        }

        public function create()
        {
            global $wpdb;

            $columns = [
                'wishlist_privacy' => '%d',
                'wishlist_name' => '%s',
                'wishlist_slug' => '%s',
                'wishlist_token' => '%s',
                'is_default' => '%d'
            ];

            $values = [
                0,
                __('Wishlist', 'wishlist'),
                '',
                uniqid(),
                0
            ];

            if (!is_user_logged_in()) {
                $columns['session_id'] = '%s';
                $values[] = $this->generate_session_id();
            } else {
                $columns['user_id'] = '%d';
                $values[] = $this->user_id;
            }

            $columns['dateadded'] = 'FROM_UNIXTIME( %d )';
            $values[] = current_time('timestamp');

            if (!is_user_logged_in()) {
                $columns['expiration'] = 'FROM_UNIXTIME( %d )';
                $values[] = current_time('timestamp');
            }

            $query_columns = implode(', ', array_map('esc_sql', array_keys($columns)));
            $query_values = implode(', ', array_values($columns));

            $query = "INSERT INTO {$wpdb->ea_wishlist_lists} ( {$query_columns} ) VALUES ( {$query_values} ) ";

            $res = $wpdb->query($wpdb->prepare($query, $values));



            if ($res) {
                return apply_filters('wishlist_successfully_created', intval($wpdb->insert_id));
            }

            return false;
        }

        public function get_current_user_wishlist()
        {
            global $wpdb;
            $wishlist_id = $wpdb->get_var("SELECT ID FROM {$wpdb->ea_wishlist_lists} WHERE user_id = {$this->user_id}");

            if ($wishlist_id) {
                return $wishlist_id;
            }

            return false;
        }

        public static function generate_session_id()
        {
            $session_id = '';

            if (is_user_logged_in()) {
                return false;
            }

            require_once ABSPATH . 'wp-includes/class-phpass.php';
            $hasher      = new PasswordHash(8, false);
            $session_id = md5($hasher->get_random_bytes(32));

            return $session_id;
        }
    }
}

function User_Wishlist()
{
    return User_Wishlist::get_instance();
}