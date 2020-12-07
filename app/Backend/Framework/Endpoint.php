<?php

namespace BetterWishlist\Backend\Framework;

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
    die;
}

trait Endpoint
{
    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes()
    {
        $namespace = $this->slug . '/v' . $this->api_version;
        $endpoint = '/wprs/';

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => array($this, 'get_wprs'),
                'permission_callback' => array($this, 'wprs_permissions_check'),
                'args' => array(),
            ),
        ));

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => array($this, 'update_wprs'),
                'permission_callback' => array($this, 'wprs_permissions_check'),
                'args' => array(),
            ),
        ));

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => \WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_wprs'),
                'permission_callback' => array($this, 'wprs_permissions_check'),
                'args' => array(),
            ),
        ));

        register_rest_route($namespace, $endpoint, array(
            array(
                'methods' => \WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_wprs'),
                'permission_callback' => array($this, 'wprs_permissions_check'),
                'args' => array(),
            ),
        ));
    }

    /**
     * Get wprs
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_wprs($request)
    {
        $wprs_option = get_option($this->option_name);

        // Don't return false if there is no option
        if (!$wprs_option) {
            return new \WP_REST_Response(array(
                'success' => true,
                'value' => '',
            ), 200);
        }

        return new \WP_REST_Response(array(
            'success' => true,
            'value' => $wprs_option,
        ), 200);
    }

    /**
     * Create OR Update wprs
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_wprs($request)
    {
        $updated = update_option($this->option_name, $request->get_param('wprsSetting'));

        return new \WP_REST_Response(array(
            'success' => $updated,
            'value' => $request->get_param('wprsSetting'),
        ), 200);
    }

    /**
     * Delete wprs
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function delete_wprs($request)
    {
        $deleted = delete_option($this->option_name);

        return new \WP_REST_Response(array(
            'success' => $deleted,
            'value' => '',
        ), 200);
    }

    /**
     * Check if a given request has access to update a setting
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function wprs_permissions_check($request)
    {
        return current_user_can('manage_options');
    }
}
